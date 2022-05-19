import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getSigningClient, getChainId } from "../../../utils/keplrHelper";
import { toast } from 'react-toastify';
import axios from 'axios';

export class ConfirmModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show || false,
        secretJs: this.props.secretJs,
        address: this.props.address,
        loading: false
      };
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false,
                address: this.props.address,
                secretJs: this.props.secretJs,
            })
        }
    }

    handleSend = async() => {
        //show spinner and disable button
        this.setState({ loading: true });

        if (!this.props.secretJs || !this.props.address){
            const secretJs = await getSigningClient();
            this.setState({
                secretJs: secretJs.client,
                address: secretJs.address
            });
        }
        
        const fee = {
            gas: process.env.REACT_APP_FACTORY_GAS || 150000,
        };

        //message for the NFT contract
        const factoryAdmin = process.env.REACT_APP_FACTORY_ADMIN || 'secret1s7hqr22y5unhsc9r4ddnj049ltn9sa9pt55nzz'
        const factoryMsg = {
            send_to_factory: {
                transfers: [{
                    recipient: factoryAdmin,
                    token_ids: [this.props.ids[0].toString()]
                },{
                    recipient: factoryAdmin,
                    token_ids: [this.props.ids[1].toString()]
                },{
                    recipient: factoryAdmin,
                    token_ids: [this.props.ids[2].toString()]
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
            asyncResponse = await this.state.secretJs.execute(
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
            this.setState({ loading: false })
            return;

        }
    
        //show error if async execute returned an error code (rare)
        if (asyncResponse.code){
          this.setState({
            show: true,
            error: true,
            tx: asyncResponse
          })
          return;
        }
    
        // get full tx response
        let fullResponse;
        try {
            //show loading toast
            const txToast = toast.loading("Transaction Processing...")

            // check if tx was processed every 3s up to 100 times
            fullResponse = await this.state.secretJs.checkTx(asyncResponse.transactionHash, 3000, 100);
            console.log('Full Response:', fullResponse);

            //check for errors
            if (fullResponse.code){
                toast.update(txToast, { render: fullResponse.raw_log, type: "error", isLoading: false, autoClose: 5000 });
                throw new Error(fullResponse.raw_log)
            }

            // display success toast
            toast.update(txToast, { render: "Transaction Processed", type: "success", isLoading: false, autoClose: 5000 });

        } catch(error) {
            this.setState({ loading: false })
            return;
        }

        //const asyncResponse = { transactionHash: "aaa"}
        //const fullResponse = asyncResponse;
        const permitName = "MTC-Factory-Order";
        const allowedDestinations = ["teddyapi.xiphiar.com", "localhost:9176", 'teddyapi-testnet.xiphiar.com'];

        //show loading toast for permit and post
        const finalToast = toast.loading("Awaiting permit signature...");

        const chainId = getChainId();
        //try permit 3 times
        let signature;
        let signed = false;
        for (let i = 0; i < 3 && !signed; i++){
            try {
                const permitTx = {
                    chain_id: chainId,
                    account_number: "0", // Must be 0
                    sequence: "0", // Must be 0
                    fee: {
                      amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
                      gas: "1", // Must be 1
                    },
                    msgs: [
                      {
                        type: "factory_order", // Must match the type on the client
                        value: {
                          permit_name: permitName,
                          allowed_destinations: allowedDestinations,
                          order_details: {
                            teddy1: this.props.ids[0],
                            teddy2: this.props.ids[1],
                            teddy3: this.props.ids[2],
                            owner: this.state.address,
                            tx_hash: asyncResponse.transactionHash,
                            base_design: this.props.base || null,
                            face: this.props.face || null,
                            color: this.props.color || null,
                            background: this.props.background || null,
                            hand: this.props.hand || null,
                            head: this.props.head || null,
                            body: this.props.body || null,
                            eyewear: this.props.eyewear || null,
                            notes: this.props.notes || null,
                            name: this.props.name || null
                          }
                        },
                      },
                    ],
                    memo: "" // Must be empty
                }
                
                console.log(JSON.stringify(permitTx, null, 2));

                const response = await window.keplr.signAmino(
                    chainId,
                    this.state.address,
                    permitTx,
                    {
                      preferNoSetFee: true, // Fee must be 0, so hide it from the user
                      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
                    }
                );
                signature = response.signature;
                signed = true;
            } catch (error) {
                console.error(error)
                if (i > 1){
                    alert(`Failed to complete factory order. Please contact staff on discord.\nTX Hash: ${fullResponse.transactionHash}`)
                } else {
                    alert(
                        error.toString().includes('Request rejected') ?
                            'You must sign the permit to complete your factory order, click OK to try again.\nIf the Keplr window is still open, please close it before clicking OK.'
                        :
                            `Error signing:\n${error.toString()}\nPlease try again, the permit must be signed to complete your order.`
                    );
                }
            }
        }

        if (!signed) {
            toast.update(finalToast, { render: "Failed to Sign Permit", type: "error", isLoading: false, autoClose: 5000});
            return;
        }

        toast.update(finalToast, { render: "Sending Order..."});

        try {
            var params = new URLSearchParams();
                params.append('permit_name', permitName);
                params.append('allowed_destinations', JSON.stringify(allowedDestinations));
                params.append('signature', JSON.stringify(signature));
                params.append('owner', this.state.address);
                params.append('tx_hash', fullResponse.transactionHash);
                params.append('teddy1', this.props.ids[0]);
                params.append('teddy2', this.props.ids[1]);
                params.append('teddy3', this.props.ids[2]);
                params.append('base', this.props.base.trim());
                params.append('face', this.props.face.trim());
                params.append('color', this.props.color.trim());
                params.append('background', this.props.background.trim());
                params.append('hand', this.props.hand.trim());
                params.append('head', this.props.head.trim());
                params.append('body', this.props.body.trim());
                params.append('eyewear', this.props.eyewear.trim());
                params.append('notes', this.props.notes);
                params.append('name', this.props.name);

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/factory`,
                params
            );

            console.log(response.data);
            toast.update(finalToast, { render: "Sent to Factory!", type: "success", isLoading: false, autoClose: 5000 });
        } catch (error) {
            const message = error.response.data.message || error.response.data || error.toString();
            console.error("abc", message)
            toast.update(finalToast, { render: (<>Failed to send order to Factory:<br/>{message}<br/><br/>Please contact a moderator on Discord.</>), type: "error", isLoading: false, autoClose: 5000 });
            alert(`Failed to send order to Factory:\n${message}\n\nPlease contact a moderator on Discord.\nTX Hash: ${fullResponse.transactionHash}\nTeddy IDs: ${this.props.ids[0]}, ${this.props.ids[1]}, ${this.props.ids[2]}`);
            return;
        }
        this.setState({loading: false})
    }

    render = () => {
        return (
            <Modal
                show={this.state.show}
                onHide={this.props.hide}
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
                            <span style={{fontSize: "16px"}}>{this.props.ids[0]}&nbsp;&nbsp;&nbsp;{this.props.ids[1]}&nbsp;&nbsp;&nbsp;{this.props.ids[2]}</span><br/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Name</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.name || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Base Design</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.base==='other' ? 'Unlisted Trait' : this.props.base || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Color</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.color==='other' ? 'Unlisted Trait' : this.props.color || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Background</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.background==='other' ? 'Unlisted Trait' : this.props.background || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Face</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.face==='other' ? 'Unlisted Trait' : this.props.face || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Hand</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.hand==='other' ? 'Unlisted Trait' : this.props.hand || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Head</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.head==='other' ? 'Unlisted Trait' : this.props.head || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Body</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.body==='other' ? 'Unlisted Trait' : this.props.body || 'None'}</span><br/>
                        </Col>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Eyewear</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.eyewear==='other' ? 'Unlisted Trait' : this.props.eyewear || 'None'}</span><br/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Owner Address</span><br/>
                            <span style={{fontSize: "12px"}}>{this.state.address}</span><br/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <span style={{fontWeight: "bold"}}>Notes</span><br/>
                            <span style={{fontSize: "12px"}}>{this.props.notes || "None"}</span><br/>
                        </Col>
                    </Row>
                    <br/>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            <p style={{fontSize: "16px", lineHeight: '145%'}}>
                                You will be asked to sign two transactions when you click Send.<br/>
                                The first transaction will transfer the teddies and fee to the factory.<br/>
                                The second is a permit containing your trait selections, TX hash, and return address.<br/>
                                You must sign <b>both</b> transactions or your teddies may be lost.<br/>
                            </p>
                            <p style={{fontSize: "15px"}}>If you encounter any issues, make note of your TX hash and contact a moderator in our Discord.</p>
                        </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col xs={"auto"}>
                            { this.state.loading ?
                                <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                            
                            :
                                <button className="modalButton" onClick={() => this.handleSend()}>Send ( 5 sSCRT )</button>
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-start">
                <Button variant="secondary" onClick={this.props.hide}>
                Back
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}