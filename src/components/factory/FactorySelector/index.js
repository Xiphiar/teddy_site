import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getPermit, getSigningClient, getQueryClient, getChainId, getAddress } from "../../../utils/keplrHelper";
//import styles from './dark.min.module.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { decryptFile, getRarityData, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData, cachePublicImage, cachePrivateImage, getPrivateImage, blobToBase64 } from '../../../utils/dataHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faUnlockKeyhole, faLink, faArrowRightArrowLeft, faKey, faArrowLeft, faLockOpen, faSpinner } from '@fortawesome/free-solid-svg-icons'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import FactoryTeddyCard from '../FactoryTeddyCard'

import styles from './styles.module.css';

//modal
//class FactorySelector extends React.Component {
function FactorySelector({selectedTeddies}){
    /*
    constructor(props) {
      super(props);
      this.state = {
        id: this.props.id,
        queryPermit: this.props.queryPermit,
        secretJs: this.props.secretJs,
        signer: false,
        nft_dossier: null,
        owned: this.props.owned || false,
        unlocked: false,
        swapped: false,
        rarityData: null,
        attributes: [],
        encryptedImage: {},
        decryptedImage: null,
        loadingUnlock: false,
        teddyRank: null
      };
    }
    */
    // componentDidUpdate(prevProps){
    //     if (this.props !== prevProps) {
    //         this.setState({
    //             id: this.props.id || null,
    //             queryPermit: this.props.queryPermit || {},
    //             secretJs: this.props.secretJs || null,
    //             owned: this.props.owned || false
    //         })
    //     }
    // }

    const processRarity = async() => {
        try {
            if (this.state.unlocked || this.state.swapped){
                const rarityData = await processRarity(this.state.attributes);
                console.log("*RARITY*",rarityData)
                this.setState({rarityData: rarityData})
            } else {
                const total = await getTotalTokens();
                const rarityTotal = {total:total};
                this.setState({rarityData: rarityTotal})
            }

        } catch (e){
            console.error("Error processing rarity:",e);
            toast.error(e, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        }
    }

    const getPermit = async() => {
        try {
            if (this.state.queryPermit.signature) {
            return;
            }

            let returned = {client: null, address: null}
            if (!this.state.secretJs || !this.state.address) {
                //get SigningCosmWasmClient and store in state
                returned = await getSigningClient();
            }
        
            const signature = await getPermit(returned.address);
            this.setState({
                secretJs: returned.client,
                address: returned.address,
                queryPermit: signature
            })
        
            return;
        } catch(e) {
            console.error("Error getting permit:",e);
            toast.error(e, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        }
    }

    const getPubData = async() => {
        //const data = await queryTokenMetadata(this.state.secretJs, this.state.id)
        const data = await getPublicTeddyData(this.state.id)
        //const total = await getTotalTokens();
        /*let data = await this.state.secretJs.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, query, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
        let attributes = {};
        for (let i = 0; i < data.nft_dossier.public_metadata.extension.attributes.length; i++) {
            attributes[data.nft_dossier.public_metadata.extension.attributes[i].trait_type] = data.nft_dossier.public_metadata.extension.attributes[i].value + "?";
            }
        */

        this.setState({
            teddyRank: data.teddyrank
        })

        /*
        const rarity = {total:total};
        const minimal_metadata = {
            public_metadata: {
                extension: {
                    image: data.pub_url
                }
            } 
        }

        this.setState({
            nft_dossier: minimal_metadata, //data.nft_dossier,
            attributes: { "Base Design": `${data.base_design}?` },
            rarityData: rarity
        });
        */
    }
    
    const queryChainData = async() => {
        //show loading spinners
        this.setState({
            loading: true,
            rarityData: null //reset rarity data when refreshing info from chain
        })
        console.log("*STATE*", this.state);
        console.log("*PROPS*", this.props);

        try {
            if (!this.state.secretJs) {
                console.log("using query client");
                const client = await getQueryClient();
                this.setState({
                  secretJs: client,
                  signer: false
                })
              }
        } catch (e) {
            console.error("Error getting client:",e,this.state.secretJs);
            this.setState({
                error: "Error getting SecretJS client."
            })
            return;
        }

        let data;
        try {
            data = await queryTokenMetadata(this.state.secretJs, this.state.id, this.state.queryPermit)
            console.log("*NFT*", data.nft_dossier);

            let owned = false;
            let unlocked = false;
            if (data.nft_dossier.private_metadata){
                unlocked = true;
                const address = await getAddress();
                if (data.nft_dossier.owner === address) {
                    owned = true;
                }
            }

            let swapped = false;
            //encrypted image is in the media key, if this key exists in public_metadata then the private metadata is swapped to public
            if (data.nft_dossier.public_metadata.extension?.media){
                swapped=true;
            }

            if (unlocked || swapped) this.getPubData();

            let attributes;
            let pubImage;
            let privImage;

            if (unlocked && !swapped) {
                console.log("Valid permit was provided. Private data is not swapped.");
                attributes = data.priv_attributes;
                pubImage = data.nft_dossier.public_metadata.extension.image;
                privImage = data.nft_dossier.private_metadata.extension.media[0];
            }

            else if (unlocked && swapped) {
                console.log("Valid permit was provided. Private data IS swapped.");
                attributes = data.pub_attributes;
                pubImage = data.nft_dossier.private_metadata.extension.image;
                privImage = data.nft_dossier.public_metadata.extension.media[0];
            }

            else if (!unlocked && swapped) {
                console.log("Valid permit was NOT provided. Private data IS swapped.");
                attributes = data.pub_attributes;
                //pubImage = data.nft_dossier.private_metadata.extension.image; //we dont have this, its in the private data
                privImage = data.nft_dossier.public_metadata.extension.media[0];
            }

            else if (!unlocked && !swapped) {
                console.log("Valid permit was NOT provided. Private data is not swapped.");
                attributes = data.pub_attributes;
                pubImage = data.nft_dossier.public_metadata.extension.image;
                //privImage = data.nft_dossier.public_metadata.extension.media[0]; //we dont have this, its in the private data
            }
            
            else {
                throw `Something went wrong. Couldnt determine if private data is swapped.`
            }

            this.setState({
                nft_dossier: data.nft_dossier,
                owned: owned,
                swapped: swapped,
                unlocked: unlocked,
                attributes: attributes,
                pubImage: pubImage,
                encryptedImage: privImage
            })

            cachePublicImage(this.state.id, pubImage)
       
        } catch (e) {
            console.error("Error getting metadata:",e);
            this.setState({
                error: `Error getting NFT metadata. ${e}`
            })
            return;
        }

        //process rarity in background
        this.processRarity();

        try {
            
            if (this.state.encryptedImage?.authentication) {
                
                const cachedPrivateImage = await getPrivateImage(this.state.id)
                if (cachedPrivateImage){
                    console.log("using cached private image")
                    this.setState({
                        decryptedImage: cachedPrivateImage
                    })
                }

                else {
                    const url = this.state.encryptedImage.url.replace('ipfs.io', process.env.REACT_APP_IPFS_MIRROR);
                    const privImage = await decryptFile(url, this.state.encryptedImage.authentication.key);

                    if (!!privImage.length) {

                        const blob = new Blob([privImage], {
                            type: `image/png`,
                        });

                        //const objURL = URL.createObjectURL(blob);
                        //console.log("Decrypted Object URL", objURL)

                        const base64 = await blobToBase64(blob);
                        //console.log("Decerypted Data base64", base64)
                        

                        this.setState({
                            //decryptedImage: `data:image/png;base64,${privImage}`
                            decryptedImage: base64
                        })
                        //cachePrivateImage(this.state.id, `data:image/png;base64,${privImage.data}`)
                        cachePrivateImage(this.state.id, base64)
                    }

                }

            }
        } catch (e) {
            console.error("Error decrypting:",e, this.state.encryptedImage, this.state.nft_dossier);
            toast.error("Error decrypting image. Check console.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
              });
            return;
        }

        //hide loading spinners
        this.setState({
            loading: false
        })

    }

    return(

        <div>

            <div className="pointer backLink" style={{width:"fit-content"}} onClick={() => this.props.handleBack()} >
                <h1 style={{display: "inline"}}>
                    <FontAwesomeIcon style={{paddingLeft: "10px"}} icon={faArrowLeft} className="pointer" title="Back to Gallery" onClick={() => this.setUriHash(this.state.id)} />
                </h1>
                <h3 style={{display: "inline"}}>&nbsp;Back to Gallery</h3>
            </div>

            { false ? //this.state?.error ?
                <div className="teddyCardError">{"todo"}</div>
            :
                <div className="anon-card">
                    <Container>
                        <FactoryTeddyCard teddyId={[selectedTeddies[0]]} />
                    </Container>
                </div>
            }
        </div>
    )


}

export default FactorySelector;