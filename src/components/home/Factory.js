import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Factory = () => {
  return (
    <Container>
      <Row className="d-md-none">
      <h1>“The Teddy Factory” perks</h1>

      </Row>
      <Row className="align-items-end">
          <Col sm="auto" className="d-none d-md-block">
            <h1 className="d-none d-md-block">“The Teddy Factory” perks</h1>
          </Col>
          <Col sm="auto" className="d-none d-md-block">
          <img src="factory.png" style={{width:"292px", height:"297px"}} align="top-right"/>
          </Col>
      </Row>
      <Row className="align-items-center">
        <Col md={{ span: 9}}>

          <p>
            Midnight Teddys are now undergoing a Evolutionary Revolution!!
            <br/>Select 3 Midnight Teddys of your choosing to burn in "Mount Doom" to create a single hybrid Midnight Teddy that combines all your favorite traits. This hybrid Teddy will be given a *customized* name chosen by the creator that will be stored on-chain forever!
            <br/>Hybrid Midnight Teddys will be assembled manually off-chain and re-added to the contract address. The newly minted hybrid Midnight Teddy will be sent to the same address as the 3 retired Midnight Teddys.
          </p>
        </Col>
        <Col md={{ span: 3}} className="justify-content-md-center">
          <div><Image src="burngallery.png" className="d-block mx-auto img-fluid"/></div>
        </Col>
      </Row>
    </Container>
  )
}

export default Factory
