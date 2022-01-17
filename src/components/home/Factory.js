import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Factory = () => {
  return (
    <Container>
      <Row className="align-items-center">
        <Col md={{ span: 9}}>
          <h1 style={{"paddingBottom":"16px"}}>“The Teddy Factory” perks</h1>
          <p>
            Midnight Teddys are now undergoing a Evolutionary Revolution!!
            <br/>Select 3 Midnight Teddys of your choosing to burn in "Mount Doom" to create a single hybrid Midnight Teddy that combines all your favorite traits. This hybrid Teddy will be given a *customized* name chosen by the creator that will be stored on-chain forever!
            <br/>Hybrid Midnight Teddys will temporarily be assembled manually off-chain and re-added to the contract address. Until we build an automated process, please allow a day or so  for this process to be completed. The newly minted hybrid Midnight Teddy will be sent to the same address as the 3 retired Midnight Teddys. 
          </p>
        </Col>
        <Col md={{ span: 3}} className="justify-content-md-center">
          <div><Image src="factoryteddy.png" className="d-block mx-auto img-fluid"/></div>
        </Col>
      </Row>
    </Container>
  )
}

export default Factory
