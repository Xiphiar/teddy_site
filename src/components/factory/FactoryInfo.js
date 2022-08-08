import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const FactoryInfo = () => {
  return (
    <Container>
      <Row className="">
        <Col md={{ span: 9}}>
        <h1 className="homeTitle">Midnight Teddy Factory</h1>

          <p>
            The Evolutionary Revolution has begun!!
            <br/>Select 3 Midnight Teddys in the gallery to send to the Factory.
          </p>
        </Col>
        <Col md={{ span: 3}} className="justify-content-md-center">
          <div><Image src="factory.png" className="d-block mx-auto img-fluid"/></div>
        </Col>
      </Row>
    </Container>
  )
}

export default FactoryInfo
