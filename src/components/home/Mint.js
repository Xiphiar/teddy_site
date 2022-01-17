import { Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";

const MintRow = () => {
  return (
    <Container fluid>
      <Row className="mintRow justify-content-center align-items-center text-center">
        <div style={{display: "inline-block"}}>
          <div style={{"paddingBottom": "32px"}}>
            <h6 className="priceTitle">Each of the mint will cost <b>21 sSCRT</b></h6>
            <h1 className="fairTitle">Fair distribution and price</h1>
          </div>

          <Link to="/mint">
            <button type="button" className="btn btn-primary me-2 mintButton teddyButton">
              MINTING SOON
            </button>
          </Link>
        </div>
      </Row>
    </Container>
  )
}

export default MintRow
