import { Col } from "react-bootstrap";
import {useState, useEffect} from 'react';
import Spinner from 'react-bootstrap/Spinner'
import { getPermit, getSigningClient, getQueryClient, getChainId, getAddress } from "../../../utils/keplrHelper";
import { decryptFile, getRarityData, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData, cachePublicImage, cachePrivateImage, getPrivateImage, blobToBase64 } from '../../../utils/dataHelper'
import { CosmWasmClient } from "secretjs";
import {toast} from 'react-toastify';

function FactoryTeddyCard({teddyId}){
    const [decryptedImage, setDecryptedImage] = useState();
    const [loading, setLoading] = useState(true);
    const [queryPermit, setQueryPermit] = useState({});
    const [secretJs, setSecretJs] = useState(new CosmWasmClient(process.env.REACT_APP_REST_URL))
    const [signerAddress, setSignerAddress] = useState();

    useEffect(() => {
        async function init(){
           await getTeddyData();
        }
        init();
    },[teddyId])

    const getTeddyData = async() => {
        try {
            if (queryPermit.signature) return;

            let returned = {client: null, address: null}
            if (!secretJs || !signerAddress) {
                //get SigningCosmWasmClient and store in state
                returned = await getSigningClient();
            }
        
            const signature = await getPermit(returned.address);
            setSecretJs(returned.client);
            setSignerAddress(returned.address);
            setQueryPermit(signature);
        
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

    const queryChainData = async() => {
        //show loading spinners
        // this.setState({
        //     loading: true,
        //     rarityData: null //reset rarity data when refreshing info from chain
        // })
        console.log("*STATE*", this.state);
        console.log("*PROPS*", this.props);

        try {
            if (!this.state.secretJs) {
                console.log("using query client");
                const client = await getQueryClient();
                // this.setState({
                //   secretJs: client,
                //   signer: false
                // })
              }
        } catch (e) {
            console.error("Error getting client:",e,this.state.secretJs);
            // this.setState({
            //     error: "Error getting SecretJS client."
            // })
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

            // this.setState({
            //     nft_dossier: data.nft_dossier,
            //     owned: owned,
            //     swapped: swapped,
            //     unlocked: unlocked,
            //     attributes: attributes,
            //     pubImage: pubImage,
            //     encryptedImage: privImage
            // })

            cachePublicImage(this.state.id, pubImage)
       
        } catch (e) {
            console.error("Error getting metadata:",e);
            // this.setState({
            //     error: `Error getting NFT metadata. ${e}`
            // })
            return;
        }

        //process rarity in background
        this.processRarity();

        try {
            
            if (this.state.encryptedImage?.authentication) {
                
                const cachedPrivateImage = await getPrivateImage(this.state.id)
                if (cachedPrivateImage){
                    console.log("using cached private image")
                    // this.setState({
                    //     decryptedImage: cachedPrivateImage
                    // })
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
                        

                        // this.setState({
                        //     //decryptedImage: `data:image/png;base64,${privImage}`
                        //     decryptedImage: base64
                        // })
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
        // this.setState({
        //     loading: false
        // })

    }

    return(
        <Col md="4" className="d-flex justify-content-center" style={{ flexDirection: "column" }}>
            <h5>Teddy {teddyId}</h5>
            { loading ?
                <div>
                    <Spinner animation="border" variant="primary" />
                    <h5>Loading...</h5>
                </div>
            :
                decryptedImage ?
                    <div className="anon-img-container">
                        <img src={decryptedImage} alt={`Midnight Teddy ${teddyId}`} key={`teddy-${teddyId}`} />
                    </div>
                :
                    <div className="anon-img-container">
                        <img src={null} alt={`Midnight Teddy ${teddyId}`} key={`teddy-${teddyId}`} />
                        <div className="imgOverlay pulsate">
                            <div className="decrypt-spinner"/>
                            <span className="overlayText">Decrypting...</span>
                        </div>
                    </div>
            }
        </Col>
    )
}

export default FactoryTeddyCard