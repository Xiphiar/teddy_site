import { Bech32 } from "@iov/encoding";
import { SecretNetworkClient } from "secretjs";
import { allowedTokens, permissions, permitName } from "./queryHelper";

let myStorage = window.sessionStorage;

export const sleep = (duration: number) => new Promise(res => setTimeout(res, duration));

export async function suggestTestnet() {
    if (!window.keplr) throw "Keplr not found"
    await window.keplr.experimentalSuggestChain({
        chainId: process.env.REACT_APP_CHAIN_ID,
        chainName: 'Secret Testnet',
        rpc: process.env.REACT_APP_RPC_URL,
        rest: process.env.REACT_APP_LCD_URL,
        bip44: {
            coinType: 529,
        },
        coinType: 529,
        bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
            {
                coinDenom: 'SCRT',
                coinMinimalDenom: 'uscrt',
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "SCRT",
                coinMinimalDenom: "uscrt",
                coinDecimals: 6,
                coinGeckoId: "secret",
                gasPriceStep: {
                    low: 0.1,
                    average: 0.25,
                    high: 0.4,
                },
            },
        ],
        stakeCurrency: {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
        },
        features: ['secretwasm', "ibc-go", "ibc-transfer"],
    });
}

export async function getPermit(address: string){
  let data = myStorage.getItem(`teddy-permit-2-${process.env.REACT_APP_CONTRACT_ADDRESS}-${address}`);
  if (data) { return JSON.parse(data); }

  if (!window.keplr) throw "Keplr not found";

  if (process.env.REACT_APP_CHAIN_ID.includes("pulsar")){
      await suggestTestnet();
  }
  window.keplr.enable(process.env.REACT_APP_CHAIN_ID);

  const { signature } = await window.keplr.signAmino(
    process.env.REACT_APP_CHAIN_ID,
    address,
    {
      chain_id: process.env.REACT_APP_CHAIN_ID,
      account_number: "0", // Must be 0
      sequence: "0", // Must be 0
      fee: {
        amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
        gas: "1", // Must be 1
      },
      msgs: [
        {
          type: "query_permit", // Must be "query_permit"
          value: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            permissions: permissions,
          },
        },
      ],
      memo: "", // Must be empty
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
    }
  );
  myStorage.setItem(`teddy-permit-2-${process.env.REACT_APP_CONTRACT_ADDRESS}-${address}`, JSON.stringify(signature));
  return signature;
}

export const getAddress = async() => {
    if (!window.keplr) throw "Keplr not found";
    const offlineSigner = window.keplr.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    return accounts[0].address;
}

export async function getSigningClient() {
    if (!window.keplr) throw "Keplr not found";
    console.log(process.env.REACT_APP_GRPC_URL, process.env.REACT_APP_CHAIN_ID)

    if (process.env.REACT_APP_CHAIN_ID.includes("pulsar")){
        await suggestTestnet();
    }

    window.keplr.enable(process.env.REACT_APP_CHAIN_ID);

    const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(process.env.REACT_APP_CHAIN_ID);
    const [{ address: myAddress }] = await offlineSigner.getAccounts();
    const enigmaUtils = window.keplr.getEnigmaUtils(process.env.REACT_APP_CHAIN_ID);

    const client = await SecretNetworkClient.create({
        grpcWebUrl: process.env.REACT_APP_GRPC_URL,
        chainId: process.env.REACT_APP_CHAIN_ID,
        wallet: offlineSigner,
        walletAddress: myAddress,
        encryptionUtils: window.keplr.getEnigmaUtils(process.env.REACT_APP_CHAIN_ID),
    });

    return {
      client: client,
      address: myAddress
    }
}

export function isValidAddress(address: string) {
    try {
        const { prefix, data } = Bech32.decode(address);
        if (prefix !== "secret") {
            return false;
        }
        return data.length === 20;
    } catch {
        return false;
    }
}

export function countDecimals(value: number) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1]?.length || 0; 
}