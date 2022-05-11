import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { getPermit, getSigningClient, getQueryClient, getChainId, getAddress } from "../../../utils/keplrHelper";
//import styles from './dark.min.module.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { decryptFile, getRarityData, queryTokenMetadata, processRarity, getTotalTokens, getPublicTeddyData, cachePublicImage, cachePrivateImage, getPrivateImage, blobToBase64 } from '../../../utils/dataHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faUnlockKeyhole, faLink, faArrowRightArrowLeft, faKey, faArrowLeft, faLockOpen, faSpinner } from '@fortawesome/free-solid-svg-icons'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import FactoryTeddyCard from '../FactoryTeddyCard';
import TraitSelect from '../TraitSelect';

import styles from './styles.module.css';


const noOptions = {
    base: [],
    face: [],
    color: [],
    background: [],
    hand: [],
    head: [],
    body: [],
    eyewear: []
}

//modal
//class FactorySelector extends React.Component {
function FactorySelector({selectedTeddies}){
    const [loading, setLoading] = useState(true);
    const [permit, setPermit] = useState();
    const [address, setAddress] = useState();
    const [client, setClient] = useState();
    const [teddyData, setTeddyData] = useState([]);
    const [selectedBase, setSelectedBase] = useState("None");
    const [selectedFace, setSelectedFace] = useState("None");
    const [selectedColor, setSelectedColor] = useState("None");
    const [selectedBackground, setSelectedBackground] = useState("None");
    const [selectedHand, setSelectedHand] = useState("None");
    const [selectedHead, setSelectedHead] = useState("None");
    const [selectedBody, setSelectedBody] = useState("None");
    const [selectedEyewear, setSelectedEyewear] = useState("None");
    
    const [options, setOptions] = useState(noOptions);
    const [notes, setNotes] = useState("");

    console.log('Render')

    const parseTraits = (nft_dossier) => {
        let attributes1 = nft_dossier.private_metadata.extension.attributes;
        let attributes2 = nft_dossier.public_metadata.extension.attributes;
        let attributes;

        if (attributes1.length > attributes2.length){
            attributes = attributes1
        } else if (attributes2.length > attributes1.length){
            attributes = attributes2
        } else if (attributes1.find(item => item.trait_type === "Base Design").value !== "Zom-Bear" || "Zom-bear" || "Ro-Bear" || "Ro-bear" || "Teddy Bear" || "Teddy bear") {
            attributes = attributes1
        } else if (attributes2.find(item => item.trait_type === "Base Design").value !== "Zom-Bear" || "Zom-bear" || "Ro-Bear" || "Ro-bear" || "Teddy Bear" || "Teddy bear") {
            attributes = attributes2
        } else {
            console.error({
                priv: attributes1,
                pub: attributes2
            })
            throw new Error(`Unable to determine private attributes.`)
        }
        return attributes;
    }

    const addOptions = (attributes, object, id) => {
        const base = attributes.find(item => item.trait_type === "Base Design")?.value
        const face = attributes.find(item => item.trait_type === "Face")?.value
        const color = attributes.find(item => item.trait_type === "Color")?.value
        const background = attributes.find(item => item.trait_type === "Background")?.value
        const hand = attributes.find(item => item.trait_type === "Hand")?.value
        const head = attributes.find(item => item.trait_type === "Head")?.value
        const body = attributes.find(item => item.trait_type === "Body")?.value
        const eyewear = attributes.find(item => item.trait_type === "Eyewear")?.value
        
        if (base) object.base.push({trait: base, id: id});
        if (face) object.face.push({trait: face, id: id});
        if (color) object.color.push({trait: color, id: id});
        if (background) object.background.push({trait: background, id: id});
        if (hand) object.hand.push({trait: hand, id: id});
        if (head) object.head.push({trait: head, id: id});
        if (body) object.body.push({trait: body, id: id});
        if (eyewear) object.eyewear.push({trait: eyewear, id: id});
        //console.log(state);
        return object;
    }

    useEffect(() => {
        setup();
    },[])
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

    const setup = async() => {
        console.log("Running Setup")
        try {
            setOptions(noOptions)

            //get SigningCosmWasmClient and store in state
            const returned = await getSigningClient();
            const signature = await getPermit(returned.address);

        
            //query all metadata
            const data = await Promise.all([
                queryTokenMetadata(returned.client, selectedTeddies[0].toString(), signature),
                queryTokenMetadata(returned.client, selectedTeddies[1].toString(), signature),
                queryTokenMetadata(returned.client, selectedTeddies[2].toString(), signature)
            ])
            console.log(data[0], data[1], data[2]);
            setTeddyData(data)

            // fucking swappable metadata
            const attributes0 = parseTraits(data[0].nft_dossier)
            const attributes1 = parseTraits(data[1].nft_dossier)
            const attributes2 = parseTraits(data[2].nft_dossier)

            let options2 = JSON.parse(JSON.stringify(noOptions))

            options2 = addOptions(attributes0, options, selectedTeddies[0].toString());
            options2 = addOptions(attributes1, options, selectedTeddies[1].toString());
            options2 = addOptions(attributes2, options, selectedTeddies[2].toString());

            console.log(options2);
            setOptions(options2);
            setLoading(false);
        
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
                    <Container style={{paddingTop: "15px"}}>
                        
                        <Row>
                        <FactoryTeddyCard teddyId={[selectedTeddies[0]]} nft_dossier={teddyData[0]?.nft_dossier} />
                        <FactoryTeddyCard teddyId={[selectedTeddies[1]]} nft_dossier={teddyData[1]?.nft_dossier} />
                        <FactoryTeddyCard teddyId={[selectedTeddies[2]]} nft_dossier={teddyData[2]?.nft_dossier} />
                        </Row>
                        <div style={{height: "30px"}} />

                        { !loading ?
                        <Form>
                        <h3 style={{paddingLeft: '10px'}}>Select Desired Traits</h3>

                        <Row style={{padding: "0px 20px"}}>
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Base Design</Form.Label>
                                <TraitSelect traitsIn={options.base} set={setSelectedBase} valueIn={selectedBase} required={true} />
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Face</Form.Label>
                                <TraitSelect traitsIn={options.face} set={setSelectedFace} valueIn={selectedFace} required={true} />
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Color</Form.Label>
                                <TraitSelect traitsIn={options.color} set={setSelectedColor} valueIn={selectedColor} required={true} />
                            </Form.Group>
                        </Row>

                        <Row style={{padding: "0px 20px"}}>
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Background</Form.Label>
                                <TraitSelect traitsIn={options.background} set={setSelectedBackground} valueIn={selectedBackground}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Hand</Form.Label>
                                <TraitSelect traitsIn={options.hand} set={setSelectedHand} valueIn={selectedHand}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Head</Form.Label>
                                <TraitSelect traitsIn={options.head} set={setSelectedHead} valueIn={selectedHead}/>
                            </Form.Group>
                        </Row>
                        <Row style={{padding: "0px 20px"}}>
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Body</Form.Label>
                                <TraitSelect traitsIn={options.body} set={setSelectedBody} valueIn={selectedBody}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Eyewear</Form.Label>
                                <TraitSelect traitsIn={options.eyewear} set={setSelectedEyewear} valueIn={selectedEyewear}/>
                            </Form.Group>
                        </Row>

                        <Row style={{padding: "20px 20px"}} className="justify-content-between">
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </Form.Group>
                            <Col md="2" className="text-right d-flex justify-content-end">
                                <Button variant="primary" type="submit" style={{alignSelf: "end"}}>
                                    Next
                                </Button>
                            </Col>
                        </Row>


                        </Form>
                        : null }
                    </Container>
                </div>
            }
        </div>
    )


}

export default FactorySelector;