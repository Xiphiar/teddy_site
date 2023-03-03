import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { getPermit } from "../../../utils/keplrHelper";
//import styles from './dark.min.module.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import FactoryTeddyCard from '../FactoryTeddyCard';
import TraitSelect from '../TraitSelect';
import { queryTokenMetadata } from '../../../utils/queryHelper';

import { getSigningClient } from '../../../utils/txHelper';

import ConfirmModal from '../ConfirmModal';

import { useGoldTokens } from '../../../contexts/GoldTokenContext';
import { SecretNetworkClient } from 'secretjs';
import { oneOfOnes } from '../../../utils/dataHelper';

import styles from './styles.module.css'
import TraitConfirmModal from '../TraitConfirmModal';

interface TraitObj {
    base: string;
    face?: string;
    color: string;
    background?: string;
    hand?: string;
    head?: string;
    body?: string;
    eyewear?: string;
}

const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz';

function TraitFactorySelector({selectedTeddies}: {selectedTeddies: [string, string]}){
    
    const [mainTeddy, setMainTeddy] = useState<any>();
    const [oneOfOneTeddy, setOneOfOneTeddy] = useState<any>();

    const [loading, setLoading] = useState(true);
    const [showNext, setShowNext] = useState(false);

    const [permit, setPermit] = useState<any>();
    const [address, setAddress] = useState<string>('Loading...');
    const [client, setClient] = useState<SecretNetworkClient>();

    const [finalTraits, setFinalTraits] = useState<TraitObj>();

    const [notes, setNotes] = useState("");

    let navigate = useNavigate();

    const parseTraits = (nft_dossier: any) => {
        let attributes1 = nft_dossier.private_metadata.extension.attributes;
        let attributes2 = nft_dossier.public_metadata.extension.attributes;
        let attributes;

        if (attributes1.length > attributes2.length){
            attributes = attributes1
        } else if (attributes2.length > attributes1.length){
            attributes = attributes2
        } else if (attributes1.find((item: any) => item.trait_type === "Base Design").value !== "Zom-Bear" || "Zom-bear" || "Ro-Bear" || "Ro-bear" || "Teddy Bear" || "Teddy bear") {
            attributes = attributes1
        } else if (attributes2.find((item: any) => item.trait_type === "Base Design").value !== "Zom-Bear" || "Zom-bear" || "Ro-Bear" || "Ro-bear" || "Teddy Bear" || "Teddy bear") {
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

    useEffect(() => {
        setup();
    },[selectedTeddies])

    const hideNext = () => {
        setShowNext(false);
    }

    const handleNext = (e: any) => {
        e.preventDefault();
        setShowNext(true);
    }

    const setup = async() => {
        console.log("Running Setup")
        try {
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
        
            //query all metadata
            const data = await Promise.all([
                queryTokenMetadata(selectedTeddies[0].toString(), signature),
                queryTokenMetadata(selectedTeddies[1].toString(), signature),
            ])
            console.log(data[0], data[1]);

            const numOneIsOneOfOne = oneOfOnes.includes(selectedTeddies[0].toString());
            let main = data[1];
            let trait = data[0];
            if (numOneIsOneOfOne) {
                setOneOfOneTeddy(data[0]);
                setMainTeddy(data[1]);

            } else {
                setOneOfOneTeddy(data[1]);
                setMainTeddy(data[0]);
                main = data[0];
                trait = data[1];
            }

            // fucking swappable metadata
            const attributesMain = parseTraits(main.nft_dossier)
            const attributesTrait = parseTraits(trait.nft_dossier)
            console.log('ATTRIBUTES!', attributesMain, attributesTrait)

            const finalTraits: TraitObj = {
                base: attributesMain.find((item: any) => item.trait_type === "Base Design").value,
                face: (attributesTrait.find((item: any) => item.trait_type === "Face") || attributesMain.find((item: any) => item.trait_type === "Face"))?.value,
                color: (attributesTrait.find((item: any) => item.trait_type === "Color") || attributesMain.find((item: any) => item.trait_type === "Color"))?.value,
                background: (attributesTrait.find((item: any) => item.trait_type === "Background") || attributesMain.find((item: any) => item.trait_type === "Background"))?.value,
                hand: (attributesTrait.find((item: any) => item.trait_type === "Hand") || attributesMain.find((item: any) => item.trait_type === "Hand"))?.value,
                head: (attributesTrait.find((item: any) => item.trait_type === "Head") || attributesMain.find((item: any) => item.trait_type === "Head"))?.value,
                body: (attributesTrait.find((item: any) => item.trait_type === "Body") || attributesMain.find((item: any) => item.trait_type === "Body"))?.value,
                eyewear: (attributesTrait.find((item: any) => item.trait_type === "Eyewear") || attributesMain.find((item: any) => item.trait_type === "Eyewear"))?.value,
            }
            setFinalTraits(finalTraits);
            setLoading(false);
        
        } catch(e: any) {
            console.error("Error getting permit:",e);
            toast.error(e.toString(), {
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
            <TraitConfirmModal show={showNext} hide={hideNext}
                address={address} permit={permit}
                selectedTeddies={selectedTeddies}
                base={finalTraits?.base} color={finalTraits?.color}
                background={finalTraits?.background} face={finalTraits?.face}
                hand={finalTraits?.hand} head={finalTraits?.head}
                body={finalTraits?.body} eyewear={finalTraits?.eyewear}
                notes={notes}
                returner={toGallery}
            />
            <div className="pointer backLink" style={{width:"fit-content"}} onClick={() => toGallery()} >
                <h1 style={{display: "inline"}}>
                    <FontAwesomeIcon style={{paddingLeft: "10px"}} icon={faArrowLeft} className="pointer" title="Back to Gallery" onClick={() => toGallery()} />
                </h1>
                <h3 style={{display: "inline"}}>&nbsp;Back to Gallery</h3>
            </div>

            { false ?
                <div className="teddyCardError">{"todo"}</div>
            :
                <Container className="d-flex justify-content-center">
                    <Col xs="auto" className={styles.selectorCard}>  
                        <Row className='justify-content-center'>
                            <FactoryTeddyCard teddyId={[selectedTeddies[0]]} nft_dossier={mainTeddy?.nft_dossier} />
                            <FactoryTeddyCard teddyId={[selectedTeddies[1]]} nft_dossier={oneOfOneTeddy?.nft_dossier} />
                        </Row>

                        <Row className='justify-content-center mt-4'>
                            { !loading ?
                            <Form className="mb-4">
                                <Row style={{padding: "20px 20px 0px"}} className="justify-content-around"> 
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


                            </Form>
                            : null }
                        </Row>
                    </Col>
                </Container>
            }
        </div>
    )


}

export default TraitFactorySelector;