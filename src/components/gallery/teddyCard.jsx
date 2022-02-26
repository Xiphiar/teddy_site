import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getPermit, getSigningClient, getQueryClient, getChainId } from "../../utils/keplrHelper";
import './teddyCard.css';
//import styles from './dark.min.module.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { decryptFile, getRarityData, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData } from '../../utils/dataHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faUnlockKeyhole, faLink, faArrowRightArrowLeft, faKey, faArrowLeft, faLockOpen, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {  SwapModal, AuthModal, AlterModal } from './modals';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';


//modal
class TeddyCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showTransferModal: false,
        showSwapModal: false,
        showAuthModal: false,
        showAlterModal: false,
        id: this.props.id,
        queryPermit: this.props.queryPermit,
        secretJs: this.props.secretJs,
        signer: false,
        nft_dossier: null,
        owned: this.props.owned || false,
        rarityData: null,
        attributes: [],
        encryptedImage: {},
        decryptedImage: null,
        loadingUnlock: false,
        teddyRank: null
      };
    }

    componentDidMount = async() => {
        this.queryChainData();
        

    }

    getAddress = async() => {
        const chainID = getChainId();
        const offlineSigner = window.getOfflineSigner(chainID);
        const accounts = await offlineSigner.getAccounts();
        return accounts[0].address;
    }

    checkIfOwned = async() => {
        if (!this.state.nft_dossier?.private_metadata){
            return false;
        }

        const address = await this.getAddress();
        if (this.state.nft_dossier.owner === address) {
            this.setState({owned: true});
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                id: this.props.id || null,
                queryPermit: this.props.queryPermit || {},
                secretJs: this.props.secretJs || null,
                owned: this.props.owned || false
            })
        }
    }

    setUriHash = () => {
        //to do copy link
            const el = document.createElement('textarea');
            el.value = `https://midnightteddyclub.art/gallery/${this.state.id}`;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            toast.success("Copied link to clipboard.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
              });
    }

    processRarity = async() => {
        try {
            const rarityData = await processRarity(this.state.attributes);
            console.log("*RARITY*",rarityData)
            this.setState({rarityData: rarityData})
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

    getPermit = async() => {
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

    getPubData = async() => {
        //const data = await queryTokenMetadata(this.state.secretJs, this.state.id)
        const data = await getPublicTeddyData(this.state.id)
        //const total = await getTotalTokens();
        /*let data = await this.state.secretJs.queryContractSmart(process.env.REACT_APP_CONTRACT_ADDRESS, query, {}, process.env.REACT_APP_CONTRACT_CODE_HASH);
        let attributes = {};
        for (let i = 0; i < data.nft_dossier.public_metadata.extension.attributes.length; i++) {
            attributes[data.nft_dossier.public_metadata.extension.attributes[i].trait_type] = data.nft_dossier.public_metadata.extension.attributes[i].value + "?";
            }
        */

        console.log(data)

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

    unlockData = async() => {
        try {
            this.setState({
                loadingUnlock: true
            })
            await this.getPermit();
            await this.queryChainData();
            this.setState({
                loadingUnlock: false
            })
        } catch(e) {
            console.error("Error unlocking data:",e);
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
    
    queryChainData = async() => {
        //show loading spinners
        this.setState({
            loading: true
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

            this.setState({ rarityData: null })

            //if has permit and private is private
            if (data.priv_attributes && data.nft_dossier.private_metadata?.extension?.media){
                console.log("permit, private is private");
                //save priv attributes to state
                this.setState({
                    nft_dossier: data.nft_dossier,
                    attributes: data.priv_attributes,
                    pubImage: data.nft_dossier.public_metadata.extension.image,
                    encryptedImage: data.nft_dossier.private_metadata.extension.media[0]
                });
                this.processRarity();
                this.checkIfOwned();
                if (this.state.owned) this.getPubData();
            }

            //else if private is public
            else if (data.priv_attributes && data.nft_dossier.private_metadata?.extension?.image) {
                console.log("permit, private is public");
                
                this.setState({
                    nft_dossier: data.nft_dossier,
                    attributes: data.pub_attributes,
                    pubImage: data.nft_dossier.private_metadata.extension.image,
                    encryptedImage: data.nft_dossier.public_metadata.extension.media[0]
                });
                this.processRarity();
                this.checkIfOwned();
                if (this.state.owned) this.getPubData();
            }

            //else has only public data AND private is public
            else if (!data.priv_attributes && data.nft_dossier.public_metadata.extension.media){
                console.log("no permit, private is public");
                //save PUB attributes and encrypted image to state
                this.setState({
                    nft_dossier: data.nft_dossier,
                    attributes: data.pub_attributes,
                    //pubImage: data.nft_dossier.private_metadata.extension.image, //we dont have this, its in the private data
                    encryptedImage: data.nft_dossier.public_metadata.extension.media[0]
                });
                this.processRarity();

            }

            //else has only public data AND private is PRIVATE
            else if (!data.priv_attributes && data.nft_dossier.public_metadata.extension.image){
                console.log("no permit, private is private");
                //save PUB attributes and encrypted image to state
                const total = await getTotalTokens();
                const rarity = {total:total};
                this.setState({
                    nft_dossier: data.nft_dossier,
                    attributes: data.pub_attributes,
                    pubImage: data.nft_dossier.public_metadata.extension.image,
                    rarityData: rarity
                    //encryptedImage: data.nft_dossier.public_metadata.extension.media[0] //we dont have this, its in the private data
                });

            } else {
                throw `Something went wrong. Couldnt determine if private data is swapped.`
            }
        } catch (e) {
            console.error("Error getting metadata:",e);
            this.setState({
                error: `Error getting NFT metadata. ${e}`
            })
            return;
        }
        
        try {
            if (this.state.encryptedImage.authentication) {
                console.log("decrypting")
                let privImage = await decryptFile(this.state.encryptedImage.url, this.state.encryptedImage.authentication.key)
                console.log("decrypted", privImage)
                this.setState({
                    decryptedImage: privImage.data
                })
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



        //show loading spinners
        this.setState({
            loading: false
        })

    }

    swapModal = (newValue) => {
        this.setState({
            showSwapModal: newValue
        })
    }

    authModal = (newValue) => {
        this.setState({
            showAuthModal: newValue
        })
    }

    alterModal = (newValue) => {
        this.setState({
            showAlterModal: newValue
        })
    }

    render(){
        return(

            <div>
                { this.state.signer ?
                <>
                    <SwapModal teddyId={this.state.id} show={this.state.showSwapModal} hide={() => this.swapModal(false)} secretJs={this.state.secretJs} address={this.state.address}/>
                    <AuthModal teddyId={this.state.id} show={this.state.showAuthModal} hide={() => this.authModal(false)} secretJs={this.state.secretJs} address={this.state.address}/>
                </>
                :
                <>
                    <SwapModal teddyId={this.state.id} show={this.state.showSwapModal} hide={() => this.swapModal(false)}/>
                    <AuthModal teddyId={this.state.id} show={this.state.showAuthModal} hide={() => this.authModal(false)}/>
                </>
                }
                <AlterModal nft={this.state.nft_dossier} show={this.state.showAlterModal} hide={() => this.alterModal(false)}/>
                <div className="pointer backLink" style={{width:"fit-content"}} onClick={() => this.props.handleBack()} >
                    <h1 style={{display: "inline"}}>
                        <FontAwesomeIcon style={{paddingLeft: "10px"}} icon={faArrowLeft} className="pointer" title="Copy Link" onClick={() => this.setUriHash(this.state.id)} />
                    </h1>
                    <h3 style={{display: "inline"}}>&nbsp;Back to Gallery</h3>
                </div>

                { this.state.error ?
                    <div className="teddyCardError">{this.state.error}</div>
                :
                    <div className="anon-card">
                
                    {this.state.nft_dossier ?
                        this.state.decryptedImage ?
                            <div className="anon-img-container">
                                <img src={`data:image/png;base64,${this.state.decryptedImage}`} alt={`Midnight Teddy ${this.state.id}`} key={`teddy-${this.state.id}`} />
                            </div>
                        :
                            <div className="anon-img-container">
                                <img src={this.state.pubImage} alt={`Midnight Teddy ${this.state.id}`} key={`teddy-${this.state.id}`} />
                                { this.state.encryptedImage.authentication ?
                                    <div className="imgOverlay pulsate">
                                        <div className="decrypt-spinner"/>
                                        <span className="overlayText">Decrypting...</span>
                                    </div>
                                :
                                    null
                                }
                            </div>
                    :
                        <div className="anon-img-container">
                            <img key={`teddy-${this.state.id}`} />
                            <div className="imgOverlay pulsate"><div className="decrypt-spinner"/></div>
                        </div>
                    }

                <div className="anon-stats">
                    <Row className="justify-content-between">
                        <Col xs={"auto"}>
                            <h2 style={{display: "inline"}}>
                                Midnight Teddy #{ this.state.id } {/*(Rank { rarityAnon.rank } / { totalAnonsCount })*/}
                            </h2>
                            <h1 style={{display: "inline"}}>
                                <FontAwesomeIcon style={{paddingLeft: "5px"}} icon={faLink} className="pointer backLink" title="Copy Link" onClick={() => this.setUriHash(this.state.id)} />
                            </h1>
                        </Col>

                        <div  style={{width: "auto"}} className="text-right">
                            <h1>
                                { this.state.encryptedImage.authentication && this.state.owned ?
                                    <div>
                                        <img src="alterlogo.png" style={{marginRight: "20px", width: "40px"}} className="pointer alterLink" onClick={() => this.alterModal(true)} />
                                        <FontAwesomeIcon style={{marginRight: "20px"}}  icon={faArrowRightArrowLeft} className="pointer backLink" title="Swap Public and Private Data" onClick={() => this.swapModal(true)} />
                                        <FontAwesomeIcon style={{marginRight: "10px"}} icon={faKey} className="pointer backLink" title="Authorize or Transfer" onClick={() => this.authModal(true)} />
                                    </div>
                                :
                                    null
                                }

                                { this.state.nft_dossier && !this.state.nft_dossier.private_metadata && !this.state.encryptedImage.authentication ?
                                    this.state.loadingUnlock ?
                                        <FontAwesomeIcon style={{marginRight: "20px"}}  icon={faSpinner} title="Trying to unlock private data..." spin/>                           
                                    :
                                        <FontAwesomeIcon style={{marginRight: "20px"}}  icon={faKey} className="pointer backLink" title="Unlock Private Data" onClick={() => this.unlockData()} />
                                
                                :
                                    null
                                }
                            </h1>
                        </div>
                    </Row>

                
                <h4>
                        Traits&nbsp;
                        { this.state.nft_dossier?.private_metadata?.extension?.image ? 
                            <FontAwesomeIcon style={{paddingRight: "20px"}}  icon={faLockOpen} title="Private data is swapped to public." />
                        :
                            null
                        }
                    </h4>
                <table>
                    <thead>
                    <tr>
                        <th>Category</th>
                        <th>
                            Trait
                        </th>
                        <th className="text-right">Trait Count</th>
                        <th className="text-right">Trait %</th>
                        <th className="text-right">Score</th>
                    </tr>
                    </thead>
                {this.state.nft_dossier ?
                    this.state.rarityData ?
                        <tbody>
        
                                { this.state.owned || this.state.nft_dossier?.public_metadata?.extension?.media ?
                                    <tr>
                                        <td>Base Design</td>
                                        <td>{ this.state.attributes["Base Design"] }</td>
                                        <td className="text-right">{ this.state.rarityData[this.state.attributes["Base Design"]].count } / { this.state.rarityData[this.state.attributes["Base Design"]].total }</td>
                                        <td className="text-right">{ (this.state.rarityData[this.state.attributes["Base Design"]].percent*100).toFixed(3) } %</td>
                                        <td className="text-right">{ this.state.rarityData[this.state.attributes["Base Design"]].score.toFixed(3) }</td>
                                    </tr>
                                :
                                    <tr>
                                        <td>Base Design</td>
                                        <td>{ this.state.attributes["Base Design"] }</td>
                                        <td className="text-right">??? / { this.state.rarityData.total }</td>
                                        <td className="text-right">??? %</td>
                                        <td className="text-right">???</td>
                                    </tr>
                                }


                            { this.state.attributes.Color ?
                                <tr>
                                    <td>Color</td>
                                    <td>{ this.state.attributes.Color }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Color].count } / { this.state.rarityData[this.state.attributes.Color].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Color].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Color].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Background ?
                                <tr>
                                    <td>Background</td>
                                    <td>{ this.state.attributes.Background }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Background].count } / { this.state.rarityData[this.state.attributes.Background].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Background].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Background].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Face ?
                                <tr>
                                    <td>Face</td>
                                    <td>{ this.state.attributes.Face }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Face].count } / { this.state.rarityData[this.state.attributes.Face].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Face].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Face].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Hand ?
                                <tr>
                                    <td>Hand</td>
                                    <td>{ this.state.attributes.Hand }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Hand].count } / { this.state.rarityData[this.state.attributes.Hand].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Hand].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Hand].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Head ?
                                <tr>
                                    <td>Head</td>
                                    <td>{ this.state.attributes.Head }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Head].count } / { this.state.rarityData[this.state.attributes.Head].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Head].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Head].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Body ?
                                <tr>
                                    <td>Body</td>
                                    <td>{ this.state.attributes.Body }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Body].count } / { this.state.rarityData[this.state.attributes.Body].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Body].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Body].score.toFixed(3) }</td>
                                </tr>
                            : null }

                            { this.state.attributes.Eyewear ?
                                <tr>
                                    <td>Eyewear</td>
                                    <td>{ this.state.attributes.Eyewear }</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Eyewear].count } / { this.state.rarityData[this.state.attributes.Eyewear].total }</td>
                                    <td className="text-right">{ (this.state.rarityData[this.state.attributes.Eyewear].percent*100).toFixed(3) } %</td>
                                    <td className="text-right">{ this.state.rarityData[this.state.attributes.Eyewear].score.toFixed(3) }</td>
                                </tr>
                            : null }
                        </tbody>
                    :
                        <tbody>
                            <tr>
                                <td>Base Design</td>
                                <td>{ this.state.attributes["Base Design"] }</td>
                                <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                            </tr>
                            { this.state.attributes.Color ?
                                <tr>
                                    <td>Color</td>
                                    <td>{ this.state.attributes.Color }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Background ?
                                <tr>
                                    <td>Background</td>
                                    <td>{ this.state.attributes.Background }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Face ?
                                <tr>
                                    <td>Face</td>
                                    <td>{ this.state.attributes.Face }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Hand ?
                                <tr>
                                    <td>Hand</td>
                                    <td>{ this.state.attributes.Hand }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Head ?
                                <tr>
                                    <td>Head</td>
                                    <td>{ this.state.attributes.Head }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Body ?
                                <tr>
                                    <td>Body</td>
                                    <td>{ this.state.attributes.Body }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }

                            { this.state.attributes.Eyewear ?
                                <tr>
                                    <td>Eyewear</td>
                                    <td>{ this.state.attributes.Eyewear }</td>
                                    <td className="text-right"></td>
                                    <td className="text-center"><i className="c-inline-spinner c-inline-spinner-white" /></td>
                                    <td className="text-right"></td>
                                </tr>
                            : null }
                        </tbody>
                :
                    <tbody>
                        <tr>
                            <td>Loading <i className="c-inline-spinner c-inline-spinner-white" /></td>
                        </tr>
                    </tbody>
                }
                </table>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                { this.state.owned || this.state.nft_dossier?.public_metadata?.extension?.media ?
                        <h3 style={{display: "inline"}}>
                            Total Rarity Score: { this.state.rarityData ?
                                this.state.rarityData.total.toFixed(3)
                            :
                                <i className="c-inline-spinner c-inline-spinner-white" />
                            }
                        </h3>
                    : null }
                    { this.state.owned ?
                        <h3 style={{display: "inline"}}>
                            Rank: { this.state.teddyRank ?
                                this.state.teddyRank
                            :
                                <i className="c-inline-spinner c-inline-spinner-white" />
                            }
                        </h3>
                    : null }
                </div>
                </div>
                </div>
                }
          </div>
        )
    }


}

export default TeddyCard;