import axios from "axios";
import { get, set } from 'idb-keyval';
import retry from 'async-await-retry';
import { download, decrypt } from './decryptHelper'

export const oneOfOnes = process.env.REACT_APP_TRAIT_IDS?.split(',') || []

const decryptFile = async (url: string, key: string) => {
    try {
        console.log('Downloading...');

        const data = await retry(
          async() => {
            const { data } = await download(url);
            return data;
          },
          undefined,
          {
            retriesMax: 5,
            interval: 1000
          },
        );
        
        console.log('Downloaded. Decrypting...')
        const decrypted = decrypt(data, key);
        return decrypted;
      /*
      return await retry(
        async() => {
          return await axios.post(
            `https://stashh.io/decrypt`,
            {
              url,
              key
            },
            {
              timeout: 10000,
              responseType: "blob"
            }
          );
        },
        null,
        {
          retriesMax: 5,
          interval: 1000
        },
      );
      */

    } catch (error) {
      throw error;
    }
  };

const getKnownImage = async(id: string, fetch = true) => {
  //try to get private image data from IDB
  const priv = await get(`MTC-Teddy-${id}-Private-Image`);
  if (priv) return priv;

  //try to get public URL from IDB
  const pub = await get(`MTC-Teddy-${id}-Public-Image`);
  if (pub) return pub;

  //get public URL from backend API
  if (fetch) {
    const data = await getPublicTeddyData(id);
    
    if (data) {    //cache in IDB
      cachePublicImage(id, data.pub_url)
  
      return data.pub_url;}

  }
  
  //else
  return false;
}

const getPrivateImage = async(id: string) => {
  //try to get private image data from IDB
  const priv = get(`MTC-Teddy-${id}-Private-Image`);
  if (priv) return priv;
  
  //else
  return false;
}

const cachePublicImage = (id: string, url: string) => {
  set(`MTC-Teddy-${id}-Public-Image`, url);
}

const cachePrivateImage = async(id: string, data: string) => {
  set(`MTC-Teddy-${id}-Private-Image`, data).then(() => console.log("successfully cached."))
  
}

const correctTrait = (trait: string) => {
  switch (trait.toLowerCase()) {
    case "i <3 mum tatoo":
      return "I <3 MUM Tattoo"
    case "terra hoodie":
      return "LUNA Hoodie"
    case "crocodile dundee hat":
      return "Crocodile Dundee hat"
    default:
      return trait
  }
}

const emptyRarity = {
  count: 0,
  percent: 0,
  score: 0,
  total: 0,
}

const getRarityData = async(traitValue: string) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/score/${traitValue}`);
    
    if (data.data.message) return emptyRarity
    return data.data;
}

const getPublicTeddyData = async(id: string) => {
  try {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teddy/${id}`);
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

const getTotalTokens = async() => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/total`);
    return data.data;
}

const verifydiscord = async (signedMessage: any, tokenId: string) => {
  var params = new URLSearchParams();
    params.append('signedMessage', signedMessage);
    params.append('tokenId', tokenId);

  const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifydiscord`, params);
  return data.data
};

const processRarity = async(attributes: any) => {
        let rarity = {}
        let total = 0;
        for (const key in attributes) {
            //dont check rarity for DAO Value
            if (key === 'DAO Value') continue;
            const data = await getRarityData(attributes[key]);
            //@ts-ignore
            rarity[attributes[key]] = data;
            total += data.score
        }
        //@ts-ignore
        rarity.total = total;
        return rarity;
}

const truncate = function (fullStr: string, strLen: number, separator = '...') {
  if (fullStr.length <= strLen) return fullStr;

  var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow/2),
      backChars = Math.floor(charsToShow/2);

  return fullStr.substr(0, frontChars) + 
         separator + 
         fullStr.substr(fullStr.length - backChars);
};

const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export { decryptFile, getRarityData, processRarity, getTotalTokens, verifydiscord, getPublicTeddyData, truncate, cachePrivateImage, cachePublicImage, getPrivateImage, getKnownImage, blobToBase64, correctTrait };
