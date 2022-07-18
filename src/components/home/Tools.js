import { Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <Container>
      <Row>
      <h1>Community Tools</h1>
      </Row>
      <Row className="align-items-center">
        <Col md={{ span: 8}}>
          
          <p>
            As Teddys are retired to “The club”, trait rarity changes. Keep track of your teddy's rarity using our dynamic rarity tracker. 
          </p>
        </Col>
        <Col md={{ span: 4}} className="justify-content-md-center text-end">
          <div style={{maxWidth:"339px"}}>
          <div style={{textAlign: "left", zIndex:"5"}}>
            <img src="trackerteddy.png" fluid/>
          </div>
          <Link to="/gallery">
            <button type="button" className="btn btn-primary me-2 rarityButton" disabled={false} style={{zIndex:"3"}}>
              Visit the Gallery
            </button>
          </Link>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Tools
