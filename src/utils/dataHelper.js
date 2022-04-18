import axios from "axios";
import { permitQuery, getChainId } from './keplrHelper'
import { get, set } from 'idb-keyval';
import retry from 'async-await-retry';

const decryptFile = async (url, key) => {
    try {
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

    } catch (error) {
      throw error;
    }
  };

const getKnownImage = async(id, fetch = true) => {
  //try to get private image data from IDB
  const priv = await get(`MTC-Teddy-${id}-Private-Image`);
  if (priv) return priv;

  //try to get public URL from IDB
  const pub = await get(`MTC-Teddy-${id}-Public-Image`);
  if (pub) return pub;

  //get public URL from backend API
  if (fetch) {
    const data = await getPublicTeddyData(id);
    
    //cache in IDB
    cachePublicImage(id, data.pub_url)

    return data.pub_url;
  }
  
  //else
  return false;
}

const getPrivateImage = async(id) => {
  //try to get private image data from IDB
  const priv = get(`MTC-Teddy-${id}-Private-Image`);
  if (priv) return priv;
  
  //else
  return false;
}

const cachePublicImage = (id, url) => {
  set(`MTC-Teddy-${id}-Public-Image`, url);
}

const cachePrivateImage = async(id, data) => {
  set(`MTC-Teddy-${id}-Private-Image`, data).then(() => console.log("successfully cached."))
  
}

const correctTrait = (trait) => {
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

const getRarityData = async(traitValue) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/score/${traitValue}`);
    return data.data;
}

const getPublicTeddyData = async(id) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teddy/${id}`);
    return data.data;
}

const getTotalTokens = async(traitValue) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/total`);
    return data.data;
}

const queryOwnedTokens = async(client, address, permit) => {
    const query = {
        tokens: {
          owner: address,
          limit: 300
        }
    }
    const chainId = getChainId();
    const query2 = new permitQuery(query, permit, chainId);
    let data = await client.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, query2, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
    return data.token_list.tokens;
}

const queryTokenMetadata = async(client, id, permit) => {
    const query = {
        nft_dossier: {
          token_id: id
        }
    }

    const chainId = getChainId();

    if (permit.signature){

        const query2 = new permitQuery(query, permit, chainId);
        const data = await client.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, query2, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
        
        let priv_attributes = {};
        for (let i = 0; i < data.nft_dossier.private_metadata.extension.attributes.length; i++) {
          priv_attributes[data.nft_dossier.private_metadata.extension.attributes[i].trait_type] = correctTrait(data.nft_dossier.private_metadata.extension.attributes[i].value);
        }

        let pub_attributes = {};
        for (let i = 0; i < data.nft_dossier.public_metadata.extension.attributes.length; i++) {
          pub_attributes[data.nft_dossier.public_metadata.extension.attributes[i].trait_type] = correctTrait(data.nft_dossier.public_metadata.extension.attributes[i].value);
        }
        return({
            nft_dossier: data.nft_dossier,
            priv_attributes: priv_attributes,
            pub_attributes: pub_attributes
        });
        
    } else {
      console.log("no permit query")
        let data = await client.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, query, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
        let attributes = {};
        let unknown = "";
        if (data.nft_dossier.public_metadata.extension.attributes.length===1) unknown = "?"
        for (let i = 0; i < data.nft_dossier.public_metadata.extension.attributes.length; i++) {
            attributes[data.nft_dossier.public_metadata.extension.attributes[i].trait_type] = data.nft_dossier.public_metadata.extension.attributes[i].value + unknown;
          }
        return({
            nft_dossier: data.nft_dossier,
            pub_attributes: attributes
        });
    }
}

const processRarity = async(attributes) => {
        let rarity = {}
        let total = 0;
        for (const key in attributes) {
            const data = await getRarityData(attributes[key]);
            rarity[attributes[key]] = data;
            total += data.score
        }
        rarity.total = total;
        return rarity;
}

const truncate = function (fullStr, strLen, separator) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow/2),
      backChars = Math.floor(charsToShow/2);

  return fullStr.substr(0, frontChars) + 
         separator + 
         fullStr.substr(fullStr.length - backChars);
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export { decryptFile, getRarityData, queryOwnedTokens, queryOwnedTickets, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData, truncate, cachePrivateImage, cachePublicImage, getPrivateImage, getKnownImage, blobToBase64 };
