import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getSigningClient, getChainId } from "../../../utils/keplrHelper";
import { toast } from 'react-toastify';
import axios from 'axios';

import { useGoldTokens } from '../../../contexts/GoldTokenContext';

const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz';
const permitName = "MTC-Factory-Order";
const allowedDestinations = ["teddyapi.xiphiar.com", "localhost:9176", 'teddyapi-testnet.xiphiar.com'];

export default function ConfirmModal(props) {
    const [show, setShow] = useState(props.show)
    const [secretJs, setSecretJs] = useState(props.secretJs)
    const [address, setAddress] = useState(props.address)
    const [loading, setLoading] = useState(false);
    const [loadingGT, setLoadingGT] = useState(false);
    const [loadingSCRT, setLoadingSCRT] = useState(false);
    const [error, setError] = useState(false)
    const [tx, setTx] = useState(undefined)
    
    const {tokens, loading: loadingTokens, refreshTokens} = useGoldTokens();

    useEffect(() =>{
        setShow(props.show);
        setSecretJs(props.secretJs);
        setAddress(props.address);
    },[props])

    const sendOrder = async(txHash, goldToken = undefined) => {
        // //show loading toast for permit and post
        // const finalToast = toast.loading("Awaiting permit signature...");

        // const chainId = getChainId();

        // //try permit 3 times
        // let signature;
        // let signed = false;
        // for (let i = 0; i < 3 && !signed; i++){
        //     try {
        //         const permitTx = {
        //             chain_id: chainId,
        //             account_number: "0", // Must be 0
        //             sequence: "0", // Must be 0
        //             fee: {
        //               amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
        //               gas: "1", // Must be 1
        //             },
        //             msgs: [
        //               {
        //                 type: "factory_order", // Must match the type on the client
        //                 value: {
        //                   permit_name: permitName,
        //                   allowed_destinations: allowedDestinations,
        //                   order_details: {
        //                     teddy1: props.ids[0],
        //                     teddy2: props.ids[1],
        //                     teddy3: props.ids[2],
        //                     owner: address,
        //                     tx_hash: txHash,
        //                     base_design: props.base || null,
        //                     face: props.face || null,
        //                     color: props.color || null,
        //                     background: props.background || null,
        //                     hand: props.hand || null,
        //                     head: props.head || null,
        //                     body: props.body || null,
        //                     eyewear: props.eyewear || null,
        //                     notes: props.notes || null,
        //                     name: props.name || null,
        //                     goldToken: goldToken || null
        //                   }
        //                 },
        //               },
        //             ],
        //             memo: "" // Must be empty
        //         }
                
        //         console.log(JSON.stringify(permitTx, null, 2));

        //         const response = await window.keplr.signAmino(
        //             chainId,
        //             address,
        //             permitTx,
        //             {
        //               preferNoSetFee: true, // Fee must be 0, so hide it from the user
        //               preferNoSetMemo: true, // Memo must be empty, so hide it from the user
        //             }
        //         );
        //         signature = response.signature;
        //         signed = true;
        //     } catch (error) {
        //         console.error(error)
        //         if (i > 1){
        //             alert(`Failed to complete factory order. Please contact staff on discord.\nTX Hash: ${txHash}`)
        //         } else {
        //             alert(
        //                 error.toString().includes('Request rejected') ?
        //                     'You must sign the permit to complete your factory order, click OK to try again.\nIf the Keplr window is still open, please close it before clicking OK.'
        //                 :
        //                     `Error signing:\n${error.toString()}\nPlease try again, the permit must be signed to complete your order.`
        //             );
        //         }
        //     }
        // }

        // if (!signed) {
        //     toast.update(finalToast, { render: "Failed to Sign Permit", type: "error", isLoading: false, autoClose: 5000});
        //     return;
        // }

        // toast.update(finalToast, { render: "Sending Order..."});
        const finalToast = toast.loading("Sending Order...");

        try {
            var params = new URLSearchParams();
                params.append('permit_name', permitName);
                params.append('allowed_destinations', JSON.stringify(allowedDestinations));
                //params.append('signature', JSON.stringify(signature));
                params.append('owner', address);
                params.append('tx_hash', txHash);
                params.append('teddy1', props.ids[0]);
                params.append('teddy2', props.ids[1]);
                params.append('teddy3', props.ids[2]);
                params.append('base', props.base.trim());
                params.append('face', props.face.trim());
                params.append('color', props.color.trim());
                params.append('background', props.background.trim());
                params.append('hand', props.hand.trim());
                params.append('head', props.head.trim());
                params.append('body', props.body.trim());
                params.append('eyewear', props.eyewear.trim());
                params.append('notes', props.notes);
                params.append('name', props.name);
                params.append('goldToken', goldToken || '');

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/factory`,
                params
            );

            console.log(response.data);
            toast.update(finalToast, { render: "Sent to Factory!", type: "success", isLoading: false, autoClose: 5000 });
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data || error.toString();
            console.error("abc", message)
            toast.update(finalToast, { render: (<>Failed to send order to Factory:<br/>{message}<br/><br/>Please contact a moderator on Discord.</>), type: "error", isLoading: false, autoClose: 5000 });
            alert(`Failed to send order to Factory:\n${message}\n\nPlease contact a moderator on Discord.\nTX Hash: ${txHash}\nTeddy IDs: ${props.ids[0]}, ${props.ids[1]}, ${props.ids[2]}`);
            return;
        }
        setLoading(false);
        setLoadingGT(false);
        setLoadingSCRT(false);
        props.returner();
    }

    const ensureSigner = async() =>{
        if (!props.secretJs || !props.address){
            const response = await getSigningClient();
            setSecretJs(response.client);
            setAddress(response.address)
            return {address: response.address, client: response.client}
        } 
        return {address, client: secretJs};
    }

    const handleSendGT = async() => {
        //show spinner and disable button
        setLoading(true);
        setLoadingGT(true);

        const {address: acctAddress} = await ensureSigner();
        
        const fee = {
            gas: process.env.REACT_APP_FACTORY_GAS + 50000 || 200000,
        };

        //messages for the NFT contracts
        const bulkTransferMsg = {
            batch_transfer_nft: {
                transfers: [{
                    recipient: factoryAdmin,
                    token_ids: [props.ids[0].toString(), props.ids[1].toString(), props.ids[2].toString()]
                }]
            }
        };

        const tokenTransferMsg = {
            transfer_nft: {
                recipient: factoryAdmin,
                token_id: tokens[0]
            }
        };

        // transfer teddies and token
        let asyncResponse;
        try{
            asyncResponse = await secretJs.multiExecute(
              [
                {
                    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                    contractCodeHash: process.env.REACT_APP_CONTRACT_CODE_HASH,
                    handleMsg: bulkTransferMsg
                },
                {
                    contractAddress: process.env.REACT_APP_TICKET_ADDRESS,
                    contractCodeHash: process.env.REACT_APP_TICKET_CODE_HASH,
                    handleMsg: tokenTransferMsg
                }
              ],
              "",
              fee
            );
            console.log(asyncResponse) 

        } catch(error){
            toast.error(error.toString(), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setLoading(false);
            setLoadingGT(false);
            return;
        }
    
        //show error if async execute returned an error code (rare)
        if (asyncResponse.code){
          setShow(true);
          setError(true);
          setTx(asyncResponse);

          return;
        }
    
        // get full tx response
        let fullResponse;
        try {
            //show loading toast
            const txToast = toast.loading("Transaction Processing...")

            // check if tx was processed every 3s up to 100 times
            fullResponse = await secretJs.checkTx(asyncResponse.transactionHash, 3000, 100);
            console.log('Full Response:', fullResponse);

            //check for errors
            if (fullResponse.code){
                toast.update(txToast, { render: fullResponse.raw_log, type: "error", isLoading: false, autoClose: 5000 });
                throw new Error(fullResponse.raw_log)
            }

            // display success toast
            toast.update(txToast, { render: "Transaction Processed", type: "success", isLoading: false, autoClose: 5000 });

        } catch(error) {
            setLoading(false);
            setLoadingGT(false);
            return;
        }

        await sendOrder(fullResponse.transactionHash, tokens[0]);
        refreshTokens(acctAddress, props.permit);
    }

    const handleSendSCRT2 = async() => {
        //show spinner and disable button
        setLoading(true);
        setLoadingSCRT(true);

        const {address: acctAddress} = await ensureSigner();
        
        const fee = {
            gas: process.env.REACT_APP_FACTORY_GAS + 50000 || 200000,
        };

        //messages for the NFT contracts
        const bulkTransferMsg = {
            batch_transfer_nft: {
                transfers: [{
                    recipient: factoryAdmin,
                    token_ids: [props.ids[0].toString(), props.ids[1].toString(), props.ids[2].toString()]
                }]
            }
        };

        const tokenTransferMsg = {
            transfer: {
                recipient: factoryAdmin,
                amount: process.env.REACT_APP_FACTORY_PRICE
            }
        };

        // transfer teddies and token
        let asyncResponse;
        try{
            asyncResponse = await secretJs.multiExecute(
              [
                {
                    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                    contractCodeHash: process.env.REACT_APP_CONTRACT_CODE_HASH,
                    handleMsg: bulkTransferMsg
                },
                {
                    contractAddress: process.env.REACT_APP_TOKEN_ADDRESS,
                    contractCodeHash: process.env.REACT_APP_TOKEN_CODE_HASH,
                    handleMsg: tokenTransferMsg
                }
              ],
              "",
              fee
            );
            console.log(asyncResponse) 

        } catch(error){
            toast.error(error.toString(), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setLoading(false);
            setLoadingSCRT(false);
            return;
        }
    
        //show error if async execute returned an error code (rare)
        if (asyncResponse.code){
          setShow(true);
          setError(true);
          setTx(asyncResponse);

          return;
        }
    
        // get full tx response
        let fullResponse;
        try {
            //show loading toast
            const txToast = toast.loading("Transaction Processing...")

            // check if tx was processed every 3s up to 100 times
            fullResponse = await secretJs.checkTx(asyncResponse.transactionHash, 3000, 100);
            console.log('Full Response:', fullResponse);

            //check for errors
            if (fullResponse.code){
                toast.update(txToast, { render: fullResponse.raw_log, type: "error", isLoading: false, autoClose: 5000 });
                throw new Error(fullResponse.raw_log)
            }

            // display success toast
            toast.update(txToast, { render: "Transaction Processed", type: "success", isLoading: false, autoClose: 5000 });

        } catch(error) {
            setLoading(false);
            setLoadingSCRT(false);
            return;
        }

        await sendOrder(fullResponse.transactionHash);

    }

    const handleSendSCRT = async() => {
        //show spinner and disable button
        setLoading(true);
        setLoadingSCRT(true);

        await ensureSigner();
        
        const fee = {
            gas: process.env.REACT_APP_FACTORY_GAS || 150000,
        };

        //message for the NFT contract
        const factoryMsg = {
            send_to_factory: {
                transfers: [{
                    recipient: factoryAdmin,
                    token_ids: [props.ids[0].toString()]
                },{
                    recipient: factoryAdmin,
                    token_ids: [props.ids[1].toString()]
                },{
                    recipient: factoryAdmin,
                    token_ids: [props.ids[2].toString()]
                },]
            }
        };  

        //message to send the SNIP20 token to the NFT contract
        const sendMsg = {
            send: {
                amount: (process.env.REACT_APP_FACTORY_PRICE || 5000000).toString(),
                recipient: process.env.REACT_APP_CONTRACT_ADDRESS,
                msg: Buffer.from(JSON.stringify(factoryMsg)).toString('base64')
            }
        }

        // transfer teddies and collect fee
        let asyncResponse;
        try{

            // submit to mempool and get tx hash
            asyncResponse = await secretJs.execute(
                process.env.REACT_APP_TOKEN_ADDRESS,
                sendMsg,
                null,
                [],
                fee,
                process.env.REACT_APP_TOKEN_CODE_HASH
            );
            console.log(asyncResponse)

        } catch(error){

            toast.error(error.toString(), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setLoading(false);
            setLoadingSCRT(false);
            return;

        }
    
        //show error if async execute returned an error code (rare)
        if (asyncResponse.code){
          setShow(true);
          setError(true);
          setTx(asyncResponse);

          return;
        }
    
        // get full tx response
        let fullResponse;
        try {
            //show loading toast
            const txToast = toast.loading("Transaction Processing...")

            // check if tx was processed every 3s up to 100 times
            fullResponse = await secretJs.checkTx(asyncResponse.transactionHash, 3000, 100);
            console.log('Full Response:', fullResponse);

            //check for errors
            if (fullResponse.code){
                toast.update(txToast, { render: fullResponse.raw_log, type: "error", isLoading: false, autoClose: 5000 });
                throw new Error(fullResponse.raw_log)
            }

            // display success toast
            toast.update(txToast, { render: "Transaction Processed", type: "success", isLoading: false, autoClose: 5000 });

        } catch(error) {
            setLoading(false);
            setLoadingSCRT(false);
            return;
        }

        await sendOrder(fullResponse.transactionHash)
            
    }

    return (
        <Modal
            show={show}
            onHide={props.hide}
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
                        <p>Please confirm your selections below.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="auto">
                            <span style={{fontWeight: "bold"}}>Teddy IDs</span><br/>
                            <span style={{fontSize: "16px"}}>{props.ids[0]}&nbsp;&nbsp;&nbsp;{props.ids[1]}&nbsp;&nbsp;&nbsp;{props.ids[2]}</span><br/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Name</span><br/>
                            <span style={{fontSize: "12px"}}>{props.name || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Base Design</span><br/>
                            <span style={{fontSize: "12px"}}>{props.base==='other' ? 'Unlisted Trait' : props.base || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Color</span><br/>
                            <span style={{fontSize: "12px"}}>{props.color==='other' ? 'Unlisted Trait' : props.color || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Background</span><br/>
                            <span style={{fontSize: "12px"}}>{props.background==='other' ? 'Unlisted Trait' : props.background || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Face</span><br/>
                            <span style={{fontSize: "12px"}}>{props.face==='other' ? 'Unlisted Trait' : props.face || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Hand</span><br/>
                            <span style={{fontSize: "12px"}}>{props.hand==='other' ? 'Unlisted Trait' : props.hand || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Head</span><br/>
                            <span style={{fontSize: "12px"}}>{props.head==='other' ? 'Unlisted Trait' : props.head || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Body</span><br/>
                            <span style={{fontSize: "12px"}}>{props.body==='other' ? 'Unlisted Trait' : props.body || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Eyewear</span><br/>
                            <span style={{fontSize: "12px"}}>{props.eyewear==='other' ? 'Unlisted Trait' : props.eyewear || 'None'}</span><br/>
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
                            <span style={{fontSize: "12px"}}>{props.notes || "None"}</span><br/>
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
                            { loadingSCRT ? 
                                <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                            :
                                <button className="modalButton" onClick={() => handleSendSCRT2()} disabled={loading}>Send ( 5 sSCRT )</button>
                            }
                            </Col>

                            <Col xs={"auto"}>
                                { loadingGT ?
                                    <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                                :
                                    loadingTokens ? 
                                        <button className="modalButton" disabled={true}>Loading Gold Tokens <i className="c-inline-spinner c-inline-spinner-white" /></button>
                                    :
                                        <button className="modalButton" onClick={() => handleSendGT()} disabled={!tokens.length}>Send ( 1 Gold Token )</button>
                                        
                                }
                            </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-start">
                <Button variant="secondary" onClick={props.hide}>
                Back
                </Button>
            </Modal.Footer>
        </Modal>
    )
}