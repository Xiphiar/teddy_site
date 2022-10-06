import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { getPermit, getSigningClient } from "../../../utils/keplrHelper";
//import styles from './dark.min.module.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import FactoryTeddyCard from '../FactoryTeddyCard';
import TraitSelect from '../TraitSelect';
import { queryTokenMetadata } from '../../../utils/queryHelper';

import ConfirmModal from '../ConfirmModal';

import { useGoldTokens } from '../../../contexts/GoldTokenContext';

const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz';

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
    const [ showNext, setShowNext ] = useState(false);

    const [permit, setPermit] = useState();
    const [address, setAddress] = useState();
    const [client, setClient] = useState();

    const [teddyData, setTeddyData] = useState([]);
    const [name, setName] = useState('');
    const [selectedBase, setSelectedBase] = useState('');
    const [selectedFace, setSelectedFace] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedBackground, setSelectedBackground] = useState("");
    const [selectedHand, setSelectedHand] = useState("");
    const [selectedHead, setSelectedHead] = useState("");
    const [selectedBody, setSelectedBody] = useState("");
    const [selectedEyewear, setSelectedEyewear] = useState("");
    
    const [options, setOptions] = useState(noOptions);
    const [notes, setNotes] = useState("");

    const {tokens, refreshTokens} = useGoldTokens();

    let navigate = useNavigate();

    const other = [selectedBase, selectedFace, selectedColor, selectedBackground, selectedHand, selectedHead, selectedBody, selectedEyewear].includes('other') ? true : false
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
        
        if (base && !object.base.find(v => v.trait === base))       object.base.push({trait: base, id: id});
        if (face && !object.face.find(v => v.trait === face))       object.face.push({trait: face, id: id});
        if (color && !object.color.find(v => v.trait === color))    object.color.push({trait: color, id: id});
        if (background &&
            !object.background.find(v => v.trait === background))   object.background.push({trait: background, id: id});
        if (hand && !object.hand.find(v => v.trait === hand))       object.hand.push({trait: hand, id: id});
        if (head && !object.head.find(v => v.trait === head))       object.head.push({trait: head, id: id});
        if (body && !object.body.find(v => v.trait === body))       object.body.push({trait: body, id: id});
        if (eyewear &&
            !object.eyewear.find(v => v.trait === eyewear))         object.eyewear.push({trait: eyewear, id: id});

        return true;
    }

    useEffect(() => {
        setup();
    },[selectedTeddies])

    const hideNext = () => {
        setShowNext(false);
    }

    const handleNext = (e) => {
        e.preventDefault();
        if (!selectedBase || selectedBase === "None") {
            toast.error('Please select a base design.')
            return
        }
        if (selectedBase !== 'Ro-Bear' && (!selectedFace || selectedFace === "None")) {
            toast.error('Please select a face.')
            return
        }
        if (!selectedColor || selectedColor === "None") {
            toast.error('Please select a color.')
            return
        }
        setShowNext(true);
    }

    const setup = async() => {
        console.log("Running Setup")
        try {
            setOptions(noOptions)
            const newOptions = JSON.parse(JSON.stringify(noOptions));

            //get SigningCosmWasmClient and store in state
            const returned = await getSigningClient();
            setAddress(returned.address);
            setClient(returned.client);
            const signature = await getPermit(returned.address);
            setPermit(signature);
            if (returned.address === factoryAdmin) {
                toast.error(`You are connected as the factory admin! Do not use the factory!`,{
                  position: "top-right",
                  autoClose: 15000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }

            if (!tokens.length) refreshTokens(returned.address, signature)
        
            //query all metadata
            const data = await Promise.all([
                queryTokenMetadata(selectedTeddies[0].toString(), signature),
                queryTokenMetadata(selectedTeddies[1].toString(), signature),
                queryTokenMetadata(selectedTeddies[2].toString(), signature)
            ])
            console.log(data[0], data[1], data[2]);
            setTeddyData(data)

            // fucking swappable metadata
            const attributes0 = parseTraits(data[0].nft_dossier)
            const attributes1 = parseTraits(data[1].nft_dossier)
            const attributes2 = parseTraits(data[2].nft_dossier)

            addOptions(attributes0, newOptions, selectedTeddies[0].toString());
            addOptions(attributes1, newOptions, selectedTeddies[1].toString());
            addOptions(attributes2, newOptions, selectedTeddies[2].toString());

            setOptions(newOptions);
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

    const toGallery = () =>{
        navigate('/gallery',{state: {connect: true}})
    }

    return(
        <div>
            <ConfirmModal show={showNext} hide={hideNext}
                secretJs={client} address={address} permit={permit}
                ids={selectedTeddies}
                base={selectedBase} color={selectedColor}
                background={selectedBackground} face={selectedFace}
                hand={selectedHand} head={selectedHead}
                body={selectedBody} eyewear={selectedEyewear}
                notes={notes} name={name}
                returner={toGallery}
            />
            <div className="pointer backLink" style={{width:"fit-content"}} onClick={() => toGallery()} >
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
                        
                        <Row className='align-items-start'>
                        <FactoryTeddyCard teddyId={[selectedTeddies[0]]} nft_dossier={teddyData[0]?.nft_dossier} />
                        <FactoryTeddyCard teddyId={[selectedTeddies[1]]} nft_dossier={teddyData[1]?.nft_dossier} />
                        <FactoryTeddyCard teddyId={[selectedTeddies[2]]} nft_dossier={teddyData[2]?.nft_dossier} />
                        </Row>
                        <div style={{height: "30px"}} />

                        { !loading ?
                        <Form style={{paddingBottom: '10px'}}>
                        <h3 style={{paddingLeft: '10px'}}>Build Your Teddy</h3>
                        <Row style={{padding: "10px 20px"}}>
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    // as="textarea"
                                    name="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <Row style={{padding: "0px 20px"}}>
                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Base Design</Form.Label>
                                <TraitSelect traitsIn={options.base} set={setSelectedBase} valueIn={selectedBase} requiredIn={true} />
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Face</Form.Label>
                                <TraitSelect traitsIn={options.face} set={setSelectedFace} valueIn={selectedFace} requiredIn={selectedBase === 'Ro-Bear' ? false : true} enabledIn={selectedBase === 'Ro-Bear' ? false : true}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="formGridState">
                                <Form.Label>Color</Form.Label>
                                <TraitSelect traitsIn={options.color} set={setSelectedColor} valueIn={selectedColor} requiredIn={true} />
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

                        <Row style={{padding: "20px 20px 0px"}} className="justify-content-between">
                            <Form.Group as={Col} md="6" controlId="formGridState">
                                <Form.Label style={{ lineHeight: '100%'}}>Notes<br/><span style={{fontSize: '10px', color: '#cccccc'}}>Recommended: Include contact information in case there are issues with your order.</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </Form.Group>
                            <Col md="2" className="text-right d-flex justify-content-end">
                                <Button variant="primary" /*type="submit"*/ onClick={handleNext} style={{alignSelf: "end"}}>
                                    Next
                                </Button>
                            </Col>
                        </Row>
                        { other? 
                            <Row style={{padding: "0px 20px"}} >
                                <Col>
                                <span>* Image must contain your desired trait.</span></Col>
                            </Row>
                        :null}


                        </Form>
                        : null }
                    </Container>
                </div>
            }
        </div>
    )


}

export default FactorySelector;