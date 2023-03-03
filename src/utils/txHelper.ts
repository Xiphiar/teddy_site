import { MsgExecuteContract, SecretNetworkClient, Tx } from "secretjs";
import { getKeplrClient } from "./keplrHelper";
import { parseTxError } from "./txErrorHelper";

const chainId = process.env.REACT_APP_CHAIN_ID;
export const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz';

export let secretJs: SecretNetworkClient;
export let walletAddr: string;

export async function getSigningClient() {
    const result = await getKeplrClient();
    return result;
}
  
export async function ensureSigningClient() {
    if (!secretJs) {
      const {client, address} = await getSigningClient();
      secretJs = client;
      walletAddr = address;
    }
}

export const txWrapper = async (
    msg: any,
    contract: string,
    hash: string,
    gas: number,
    checkErrors = true,
  ): Promise<Tx> => {
    try {
        await ensureSigningClient()

        const response = await secretJs.tx.compute.executeContract({
          sender: walletAddr,
          contractAddress: contract,
          codeHash: hash,
          msg
        },
        {
          gasLimit: gas,
        });

        console.log('Message:', JSON.stringify(msg, undefined, 2));
        console.log('Response:', response);

        if (checkErrors) parseTxError(response);
        return response;
    } catch (error: any) {
        console.error(error);
        if (
            error.toString().includes('Network Error') ||
            error.toString().includes('503') ||
            error.toString().includes('Response closed without headers')
        ) {
            throw 'Failed to access network. The node may be experiencing issues.';
        } else {
            throw error;
        }
    }
};

export const swapMetadata = async(token_id: string) => {
    const msg = {
        to_pub: {
          token_id,
        }
    }

    return await txWrapper(msg, process.env.REACT_APP_CONTRACT_ADDRESS, process.env.REACT_APP_CONTRACT_CODE_HASH, 175_000);
}

export const addViewer = async(token_id: string, address: string) => {
    const authMsg = {
      set_whitelisted_approval : {
        address,
        token_id,
        view_private_metadata: "approve_token"
      }
    }  

    return await txWrapper(authMsg, process.env.REACT_APP_CONTRACT_ADDRESS, process.env.REACT_APP_CONTRACT_CODE_HASH, 175_000);
}

export const transferNft = async(token_id: string, recipient: string) => {
    const transferMsg = {
      transfer_nft : {
        token_id,
        recipient,
      }
    } 

    return await txWrapper(transferMsg, process.env.REACT_APP_CONTRACT_ADDRESS, process.env.REACT_APP_CONTRACT_CODE_HASH, 250_000);
}

export const mintSingle = async() => {
    //message for the NFT contract
    const mintMsg = {
      receive_mint: {}
    };    

    //message to send the SNIP20 token to the NFT contract
    const sendMsg = {
      send: {
        amount: process.env.REACT_APP_MINT_PRICE,
        recipient: process.env.REACT_APP_CONTRACT_ADDRESS,
        msg: Buffer.from(JSON.stringify(mintMsg)).toString('base64')
      }
    }

    return await txWrapper(sendMsg, process.env.REACT_APP_TOKEN_ADDRESS, process.env.REACT_APP_TOKEN_CODE_HASH, 1_000_000);
}

// export const sendFactorySSCRT = async(ids: number[]) => {
//     //message for the NFT contract
//     const factoryMsg = {
//       send_to_factory: {
//         transfers: [{
//           recipient: factoryAdmin,
//           token_ids: [ids[0].toString()]
//         },{
//           recipient: factoryAdmin,
//           token_ids: [ids[1].toString()]
//         },{
//           recipient: factoryAdmin,
//           token_ids: [ids[2].toString()]
//         },]
//       }
//     };  

//     //message to send the SNIP20 token to the NFT contract
//     const sendMsg = {
//       send: {
//           amount: (process.env.REACT_APP_FACTORY_PRICE || 5000000).toString(),
//           recipient: process.env.REACT_APP_CONTRACT_ADDRESS,
//           msg: Buffer.from(JSON.stringify(factoryMsg)).toString('base64')
//       }
//     }

//     return await txWrapper(sendMsg, process.env.REACT_APP_TOKEN_ADDRESS, process.env.REACT_APP_TOKEN_CODE_HASH, 1_000_000);
// }

export const sendFactorySSCRT = async(ids: string[]) => {
  try {
    await ensureSigningClient()

    //messages for the NFT contracts
    const bulkTransferMsg = {
      batch_transfer_nft: {
          transfers: [{
              recipient: factoryAdmin,
              token_ids: [ids[0], ids[1], ids[2]]
          }]
      }
    };

    const tokenTransferMsg = {
      transfer: {
          recipient: factoryAdmin,
          amount: process.env.REACT_APP_FACTORY_PRICE
      }
    };

    // Execute messages to broadcast
    const teddyXfer = new MsgExecuteContract({
      sender: walletAddr,
      msg: bulkTransferMsg,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      codeHash: process.env.REACT_APP_CONTRACT_CODE_HASH,
    })

    const tokenXfer = new MsgExecuteContract({
      sender: walletAddr,
      msg: tokenTransferMsg,
      contractAddress: process.env.REACT_APP_TOKEN_ADDRESS,
      codeHash: process.env.REACT_APP_TOKEN_CODE_HASH,
    })

    const response = await secretJs.tx.broadcast([teddyXfer, tokenXfer], { gasLimit: 1_000_000, broadcastTimeoutMs: 90_000 })
    console.log('Message:', JSON.stringify([teddyXfer, tokenXfer], undefined, 2));
    console.log('Response:', response);

    parseTxError(response);
    return response;
  } catch (error: any) {
    console.error(error);
    if (
      error.toString().includes('Network Error') ||
      error.toString().includes('503') ||
      error.toString().includes('Response closed without headers')
    ) {
      throw 'Failed to access network. The node may be experiencing issues.';
    } else {
      throw error;
    }
}
}

export const sendFactoryGT = async(ids: string[], token_id: string) => {
  try {
    await ensureSigningClient()

    //messages for the NFT contracts
    const bulkTransferMsg = {
        batch_transfer_nft: {
            transfers: [{
                recipient: factoryAdmin,
                token_ids: [ids[0], ids[1], ids[2]]
            }]
        }
    };

    const tokenTransferMsg = {
        transfer_nft: {
            recipient: factoryAdmin,
            token_id
        }
    };

    const teddyXfer = new MsgExecuteContract({
      sender: walletAddr,
      msg: bulkTransferMsg,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      codeHash: process.env.REACT_APP_CONTRACT_CODE_HASH,
    })

    const gtXfer = new MsgExecuteContract({
      sender: walletAddr,
      msg: tokenTransferMsg,
      contractAddress: process.env.REACT_APP_TICKET_ADDRESS,
      codeHash: process.env.REACT_APP_TICKET_HASH,
    })

    const response = await secretJs.tx.broadcast([teddyXfer, gtXfer], { gasLimit: 1_000_000, broadcastTimeoutMs: 90_000 })
    console.log('Message:', JSON.stringify([teddyXfer, gtXfer], undefined, 2));
    console.log('Response:', response);

    parseTxError(response);
    return response;
  } catch (error: any) {
    console.error(error);
    if (
      error.toString().includes('Network Error') ||
      error.toString().includes('503') ||
      error.toString().includes('Response closed without headers')
    ) {
      throw 'Failed to access network. The node may be experiencing issues.';
    } else {
      throw error;
    }
}
}

export const sendFactoryTrait = async(ids: string[]) => {
  try {
    await ensureSigningClient()

    //messages for the NFT contracts
    const bulkTransferMsg = {
      batch_transfer_nft: {
          transfers: [{
              recipient: factoryAdmin,
              token_ids: [ids[0], ids[1]]
          }]
      }
    };

    // Execute messages to broadcast
    const teddyXfer = new MsgExecuteContract({
      sender: walletAddr,
      msg: bulkTransferMsg,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      codeHash: process.env.REACT_APP_CONTRACT_CODE_HASH,
    })

    const response = await secretJs.tx.broadcast([teddyXfer], { gasLimit: 500_000, broadcastTimeoutMs: 90_000 })
    console.log('Message:', JSON.stringify([teddyXfer], undefined, 2));
    console.log('Response:', response);

    parseTxError(response);
    return response;
  } catch (error: any) {
    console.error(error);
    if (
      error.toString().includes('Network Error') ||
      error.toString().includes('503') ||
      error.toString().includes('Response closed without headers')
    ) {
      throw 'Failed to access network. The node may be experiencing issues.';
    } else {
      throw error;
    }
}
}