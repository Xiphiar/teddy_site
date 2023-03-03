import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { toast } from 'react-toastify';
import axios from 'axios';

import { useGoldTokens } from '../../../contexts/GoldTokenContext';
import { getSigningClient, factoryAdmin, sendFactorySSCRT, sendFactoryGT, sendFactoryTrait } from '../../../utils/txHelper';
import { SecretNetworkClient } from 'secretjs';

const permitName = "MTC-Factory-Order";
const allowedDestinations = ["teddyapi.xiphiar.com", "localhost:9176", 'teddyapi-testnet.xiphiar.com'];

interface Props {
    selectedTeddies: [string, string];
    base?: string;
    face?: string;
    color?: string;
    background?: string;
    hand?: string;
    head?: string;
    body?: string;
    eyewear?: string;
    notes: string;
    returner: () => void;
    permit: any;
    hide: () => void;
    show: boolean;
    address: string;
}

export default function TraitConfirmModal({
        selectedTeddies,
        base,
        face,
        color,
        background,
        hand,
        head,
        body,
        eyewear,
        notes,
        returner,
        permit,
        hide,
        ...rest
    }: Props
) {
    const [show, setShow] = useState(rest.show)
    const [address, setAddress] = useState(rest.address)
    const [loading, setLoading] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [error, setError] = useState(false)
    const [tx, setTx] = useState(undefined)
    
    const {tokens, loading: loadingTokens, refreshTokens} = useGoldTokens();

    useEffect(() =>{
        setShow(rest.show);
        setAddress(rest.address);
    },[rest])

    console.log('ISSUES!!', base, background, color, face)

    const sendOrder = async(txHash: string, goldToken = undefined) => {
        const finalToast = toast.loading("Sending Order... Do not leave or refresh this page.");

        try {
            var params = new URLSearchParams();
                params.append('owner', address);
                params.append('tx_hash', txHash);
                params.append('teddy1', selectedTeddies[0]);
                params.append('teddy2', selectedTeddies[1]);
                params.append('notes', notes);

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/trait_order`,
                params
            );

            console.log(response.data);
            toast.update(finalToast, { render: "Sent to Factory!", type: "success", isLoading: false, autoClose: 5000 });
        } catch (error) {
            //@ts-ignore
            const message = error.response?.data?.message || error.response?.data || error.toString();
            console.error("abc", message)
            toast.update(finalToast, { render: (<>Failed to send order to Factory:<br/>{message}<br/><br/>Please contact a moderator on Discord.</>), type: "error", isLoading: false, autoClose: 5000 });
            alert(`Failed to send order to Factory:\n${message}\n\nPlease contact a moderator on Discord.\nTX Hash: ${txHash}\nTeddy IDs: ${selectedTeddies[0]}, ${selectedTeddies[1]}`);
            return;
        }
        setLoading(false);
        setLoadingSend(false);
        returner();
    }

    const handleSend = async() => {
        try {
            //show spinner and disable button
            setLoading(true);
            setLoadingSend(true);

            const result = await sendFactoryTrait(selectedTeddies);

            await sendOrder(result.transactionHash);

        } catch(error: any) {
            console.error(error);
            toast.error(error.toString())

            setLoading(false);
            setLoadingSend(false);
        }
    }

    return (
        <Modal
            show={show}
            onHide={hide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName="mintModal"
            centered
        >
            <Modal.Header>
                <div style={{width: "100%"}} className="text-center"><h3>Confirm Factory Order</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Please confirm your order below.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="auto">
                            <span style={{fontWeight: "bold"}}>Teddy IDs</span><br/>
                            <span style={{fontSize: "16px"}}>{selectedTeddies[0]}&nbsp;&nbsp;&nbsp;{selectedTeddies[1]}</span><br/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Base Design</span><br/>
                            <span style={{fontSize: "12px"}}>{base || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Color</span><br/>
                            <span style={{fontSize: "12px"}}>{color || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Background</span><br/>
                            <span style={{fontSize: "12px"}}>{background || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Face</span><br/>
                            <span style={{fontSize: "12px"}}>{face || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Hand</span><br/>
                            <span style={{fontSize: "12px"}}>{hand || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Head</span><br/>
                            <span style={{fontSize: "12px"}}>{head || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Body</span><br/>
                            <span style={{fontSize: "12px"}}>{body || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Eyewear</span><br/>
                            <span style={{fontSize: "12px"}}>{eyewear || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Owner Address</span><br/>
                            <span style={{fontSize: "12px"}}>{address}</span><br/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Notes</span><br/>
                            <span style={{fontSize: "12px"}}>{notes || "None"}</span><br/>
                        </Col>
                    </Row>
                    <br/>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            <p style={{fontSize: "15px"}}>If you encounter any issues, make note of your TX hash and contact a moderator in our Discord.</p>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                            <Col xs={"auto"}>
                            { loadingSend ? 
                                <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                            :
                                <button className="modalButton" onClick={() => handleSend()} disabled={loading}>Send ( Free )</button>
                            }
                            </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-start">
                <Button variant="secondary" onClick={hide}>
                Back
                </Button>
            </Modal.Footer>
        </Modal>
    )
}