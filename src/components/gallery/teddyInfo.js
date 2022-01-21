import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

//modal
class TeddyInfo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show || false
      };
    }

    componentDidMount = () => {
        //check for owned prop and query priv data
        //otherwise show provided public data
    }

    handleClose = () => {
        this.setState({show: false})
    }

    handleShow = () => {
        this.setState({show: true})
    }

    render(){
        console.log("DATAA", this.props.data)
        return(
        <Modal
            show={this.props.show}
            onHide={this.props.hide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                Midnight Teddy #{this.props.data?.id}
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col md={4}>
                            aaaaaaaaa
                        </Col>
                        <Col md={8}>
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

export default TeddyInfo;