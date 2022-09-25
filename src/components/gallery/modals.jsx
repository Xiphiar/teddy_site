import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getSigningClient, getPermit, permitName, allowedTokens, permissions } from "../../utils/keplrHelper";
import './teddyCard.css';
import { toast } from 'react-toastify';
//import styles from './dark.min.module.css';

export class SwapModal extends React.Component {
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
                show: this.props.show || false
            })
        }
    }

    handleSwap = async() => {
        //show spinner and disable button
        this.setState({ loading: true });

        if (!this.props.secretJs || !this.props.address){
            const secretJs = await getSigningClient();
            this.setState({secretJs: secretJs.client, address: secretJs.address});
        }
        
        const fee = {
            gas: 150_000,
        };

        const swapMsg = {
            to_pub: {
                token_id: this.props.teddyId
            }
        }  


        let asyncResponse;
        try{
            console.log(this.state);
        
            //returns tx hash only
            asyncResponse = await this.state.secretJs.execute(
                process.env.REACT_APP_CONTRACT_ADDRESS,
                swapMsg,
                null,
                [],
                fee,
                process.env.REACT_APP_CONTRACT_CODE_HASH
            );
            console.log(asyncResponse)
                
        //catch and show error while posting TX
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
    
        //show processing toast
        await toast.promise(
            this.state.secretJs.checkTx(asyncResponse.transactionHash, 3000, 100),
            {
              pending: {
                render(){
                    return "Transaction Processing"
                },
                icon: true,
              },
              success: {
                render({data}){
                    console.log(data);
                    if (data.code){
                        throw(data.raw_log)
                    }
                    return `Metadata Swapped`
                },
                // other options
                //icon: "🟢",
              },
              error: {
                render({data}){
                    console.error(data);
                    // When the promise reject, data will contains the error
                    return data
                }
              }
            }
        )
        this.setState({loading: false})
        /*
        const fuck = toast("Transaction Processing...",
            {
                position: "top-right",
                hideProgressBar: true,
                closeOnClick: false,
                draggable: true,
                autoClose: false,
                
            }
        );
        
        //poll endpoint for TX to know when it processes 10 times 1000ms delay 
        const fullResponse = await this.state.secretJs.checkTx(asyncResponse.transactionHash, 3000, 100);
    
        //if tx failed show error
        if (fullResponse.code){
          this.setState({
            loading: false
          })
          toast.dismiss(fuck);
          return;
        }
    
        //show success toast
        this.setState({
          loading: false
        })
        toast.success("Transaction Processed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        */
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
                <div style={{width: "100%"}} className="text-center"><h3>Swap Metadata</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Reveal the private image and traits of your teddy to the public by swapping the metadata. The private traits will become the public traits.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            { this.state.loading ?
                                <button className="modalButton" disabled={true}><i className="c-inline-spinner c-inline-spinner-white" /></button>
                            
                            :
                                <button className="modalButton" onClick={() => this.handleSwap()}>Swap</button>
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export class AlterModal extends React.Component {
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
                show: this.props.show || false
            })
        }
    }

    copyText(input, type){

        const el = document.createElement('textarea');
        el.value = input;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast.success(`Copied ${type} to clipboard.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
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
                <div style={{width: "100%"}} className="text-center"><h3>ALTER Subscription</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Each Teddy mint includes a 1-year ALTER subscription redeemable at <a href="https://altermail.live">altermail.live</a><br/>
                        The login for your ALTER account is below. This may only be claimed once. If it has been claimed you will not be able to login.</p>

                        <div>
                            <h4>Username:&nbsp;</h4>
                            <span className="pointer" onClick={() => this.copyText(this.props.nft?.private_metadata?.extension?.alter_username, "username")}>{this.props.nft?.private_metadata?.extension?.alter_username}</span>
                        </div>
                        <div style={{paddingTop: "20px"}}>
                            <h4>Password:&nbsp;</h4>
                            <span className="pointer" onClick={() => this.copyText(this.props.nft?.private_metadata?.extension?.alter_password, "password")}>{this.props.nft?.private_metadata?.extension?.alter_password}</span>
                        </div>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export class AuthModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show || false,
        secretJs: this.props.secretJs,
        address: this.props.address,
        loading: false,
        input: "",
        input2: ""
      };
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                show: this.props.show || false
            })
        }
    }

    handleAuthorize = async() => {
        //show spinner and disable button
        this.setState({ loading: true });

        if (!this.props.secretJs || !this.props.address){
            const secretJs = await getSigningClient();
            this.setState({secretJs: secretJs.client, address: secretJs.address});
        }
        
        const fee = {
            gas: 150_000,
        };

        const authMsg = {
            set_whitelisted_approval : {
                address: this.state.input,
                token_id: this.props.teddyId,
                view_private_metadata: "approve_token"
            }
        }  


        let asyncResponse;
        try{
            console.log(this.state);
        
            //returns tx hash only
            asyncResponse = await this.state.secretJs.execute(
                process.env.REACT_APP_CONTRACT_ADDRESS,
                authMsg,
                null,
                [],
                fee,
                process.env.REACT_APP_CONTRACT_CODE_HASH
            );
            console.log(asyncResponse)
                
        //catch and show error while posting TX
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
    
        //show processing toast
        await toast.promise(
            this.state.secretJs.checkTx(asyncResponse.transactionHash, 3000, 100),
            {
              pending: {
                render(){
                    return "Transaction Processing"
                },
                icon: true,
              },
              success: {
                render({data}){
                    console.log(data);
                    if (data.code){
                        throw(data.raw_log)
                    }
                    return `Address Authorized`
                },
                // other options
                //icon: "🟢",
              },
              error: {
                render({data}){
                    console.error(data);
                    // When the promise reject, data will contains the error
                    return data
                }
              }
            }
        )
        this.setState({loading: false})
    }

    handleTransfer = async() => {
        //show spinner and disable button
        this.setState({ loading: true });

        if (!this.props.secretJs || !this.props.address){
            const secretJs = await getSigningClient();
            this.setState({secretJs: secretJs.client, address: secretJs.address});
        }
        
        const fee = {
            gas: 150_000,
        };

        const transferMsg = {
            transfer_nft : {
                recipient: this.state.input2,
                token_id: this.props.teddyId,
            }
        }  


        let asyncResponse;
        try{
            console.log(this.state);
        
            //returns tx hash only
            asyncResponse = await this.state.secretJs.execute(
                process.env.REACT_APP_CONTRACT_ADDRESS,
                transferMsg,
                null,
                [],
                fee,
                process.env.REACT_APP_CONTRACT_CODE_HASH
            );
            console.log(asyncResponse)
                
        //catch and show error while posting TX
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
    
        //show processing toast
        await toast.promise(
            this.state.secretJs.checkTx(asyncResponse.transactionHash, 3000, 100),
            {
              pending: {
                render(){
                    return "Transaction Processing"
                },
                icon: true,
              },
              success: {
                render({data}){
                    console.log(data);
                    if (data.code){
                        throw(data.raw_log)
                    }
                    return `Teddy transferred.`
                },
                // other options
                //icon: "🟢",
              },
              error: {
                render({data}){
                    console.error(data);
                    // When the promise reject, data will contains the error
                    return data
                }
              }
            }
        )
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
                <div style={{width: "100%"}} className="text-center"><h3>Authorize and Transfer</h3></div>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <p>Authorize an address to view your teddy's private metadata.<br/>
                        The viewer can lookup the ID and click the key to unlock the private data.</p>
                        
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            Address
                        <input className="addressBox" value={this.state.input} style={{marginLeft:"10px"}} onChange={(event) => this.setState({input: event.target.value})} />
                        <button className="modalButton"  style={{marginLeft:"20px"}} onClick={() => this.handleAuthorize()}> Authorize </button>
                        </Col>
                    </Row>
                    <Row style={{paddingTop:"50px"}}>
                        <p>Transfer your teddy to another Secret Network address.</p>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={"auto"}>
                            Recipient
                        <input className="addressBox" value={this.state.input2} style={{marginLeft:"10px"}} onChange={(event) => this.setState({input2: event.target.value})} />
                        <button className="modalButton"  style={{marginLeft:"20px"}} onClick={() => this.handleTransfer()}> Transfer </button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.hide}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export default { SwapModal, AuthModal };