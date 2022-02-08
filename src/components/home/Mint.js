import { Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Countdown from 'react-countdown';


  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Link to="/mint">
          <button type="button" className="btn btn-primary me-2 mintButton teddyButton">
            MINT A TEDDY
          </button>
        </Link>
      );
    } else {
      // Render a countdown
      return(
        <button type="button" disabled={true} className="btn btn-primary me-2 mintButton teddyButton">
          <span>{days}D {hours}H {minutes}M {seconds}S</span>
        </button>
      );
    }
  };

const MintRow = ({handleMint}) => {

  let date = new Date(Date.UTC(2022, 1, 26, 14))
  return (
    <Container fluid>
      <Row className="mintRow justify-content-center align-items-center text-center">
        <div style={{display: "inline-block"}}>
          <div style={{"paddingBottom": "32px"}}>
            <h6 className="priceTitle">Each mint will cost <b>21 sSCRT</b></h6>
            <h1 className="fairTitle">Fair distribution and price</h1>
          </div>

          <Countdown date={date } renderer={renderer} />
        </div>
      </Row>
    </Container>
  )
}

export default MintRow
