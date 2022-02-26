import axios from "axios";
import { permitQuery, getChainId } from './keplrHelper'

const decryptFile = async (url, key) => {
    try {
      return await axios.post(`https://stashh.io/decrypt`, { url, key });
    } catch (error) {
      throw error;
    }
  };

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
          limit: 200
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
          priv_attributes[data.nft_dossier.private_metadata.extension.attributes[i].trait_type] = data.nft_dossier.private_metadata.extension.attributes[i].value;
        }

        let pub_attributes = {};
        for (let i = 0; i < data.nft_dossier.public_metadata.extension.attributes.length; i++) {
          pub_attributes[data.nft_dossier.public_metadata.extension.attributes[i].trait_type] = data.nft_dossier.public_metadata.extension.attributes[i].value;
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

export { decryptFile, getRarityData, queryOwnedTokens, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData, truncate };