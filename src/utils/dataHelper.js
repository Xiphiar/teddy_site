import axios from "axios";
import { permitQuery, getChainId } from './keplrHelper'
import { get, set } from 'idb-keyval';
import retry from 'async-await-retry';
import { download, decrypt } from './decryptHelper'

const decryptFile = async (url, key) => {
    try {
        console.log('Downloading...');

        const data = await retry(
          async() => {
            const { data } = await download(url);
            return data;
          },
          null,
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
    
    if (data) {    //cache in IDB
      cachePublicImage(id, data.pub_url)
  
      return data.pub_url;}

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

const emptyRarity = {
  count: 0,
  percent: 0,
  score: 0,
  total: 0,
}

const getRarityData = async(traitValue) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/score/${traitValue}`);
    
    if (data.data.message) return emptyRarity
    return data.data;
}

const getPublicTeddyData = async(id) => {
  try {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teddy/${id}`);
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

const getTotalTokens = async(traitValue) => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rarity/total`);
    return data.data;
}

const verifydiscord = async (signedMessage, tokenId) => {
  var params = new URLSearchParams();
    params.append('signedMessage', signedMessage);
    params.append('tokenId', tokenId);

  const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verifydiscord`, params);
  return data.data
};

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

const queryOwnedTickets = async(client, address, permit) => {
  const query = {
      tokens: {
        owner: address,
        limit: 300
      }
  }
  const chainId = getChainId();
  const query2 = new permitQuery(query, permit, chainId);
  let data = await client.queryContractSmart(process.env.REACT_APP_TICKET_ADDRESS, query2, {}, process.env.REACT_APP_TICKET_CODE_HASH);
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
        console.log(data.nft_dossier)
        if (data.nft_dossier.private_metadata){
          for (let i = 0; i < data.nft_dossier.private_metadata.extension.attributes.length; i++) {
            priv_attributes[data.nft_dossier.private_metadata.extension.attributes[i].trait_type] = correctTrait(data.nft_dossier.private_metadata.extension.attributes[i].value);
          };
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

const batchQueryTokenMetadata = async(client, ids, permit) => {
  const query = {
      batch_nft_dossier: {
        token_ids: ids
      }
  }
  console.log(query)
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
            //dont check rarity for DAO Value
            if (key === 'DAO Value') continue;
            const data = await getRarityData(attributes[key]);
            rarity[attributes[key]] = data;
            total += data.score
        }
        rarity.total = total;
        return rarity;
}

const truncate = function (fullStr, strLen, separator = '...') {
  if (fullStr.length <= strLen) return fullStr;

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

export { decryptFile, getRarityData, queryOwnedTokens, queryOwnedTickets, queryTokenMetadata, batchQueryTokenMetadata, processRarity, getTotalTokens, verifydiscord, getPublicTeddyData, truncate, cachePrivateImage, cachePublicImage, getPrivateImage, getKnownImage, blobToBase64 };
