import { Container, Row, Col } from 'react-bootstrap'

const Tools = () => {
  return (
    <Container>
      <Row className="align-items-center">
        <Col md={{ span: 8}}>
          <h1 style={{"paddingBottom":"16px"}}>Community Tools</h1>
          <p>
            As Teddys are retired to “The club” Traits rarity changes keep track on your teddys rarity using our dynamic rairty tracker. 
          </p>
        </Col>
        <Col md={{ span: 4}} className="justify-content-md-center text-end">
          <button type="button" className="btn btn-primary me-2 rarityButton">
            CHECK RARITY
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default Tools
