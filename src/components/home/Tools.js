import { Container, Row, Col } from 'react-bootstrap'

const Tools = () => {
  return (
    <Container>
      <Row>
      <h1>Community Tools</h1>
      </Row>
      <Row className="align-items-center">
        <Col md={{ span: 8}}>
          
          <p>
            As Teddys are retired to “The club” Traits rarity changes keep track on your teddys rarity using our dynamic rairty tracker. 
          </p>
        </Col>
        <Col md={{ span: "auto"}} className="justify-content-md-center text-end">
          <div style={{textAlign: "left", zIndex:"5"}}>
            <img src="trackerteddy.png" fluid/>
          </div>
          <button type="button" className="btn btn-primary me-2 rarityButton" disabled={true} style={{zIndex:"3"}}>
            COMING SOON
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default Tools
