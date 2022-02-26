import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Specs = () => {
  return (
    <Container>
      <Row className="d-md-none">
        <h1>The specs</h1>
      </Row>
      <Row className="align-items-top">
        <Col lg={6} md={6} sm={12}>
          <Image src="2357.png" fluid={true}/>
        </Col>
        <Col lg={6} md={6} sm={12}>
          <div style={{height:"5%"}} className="d-none d-md-block"/>
          <h1 className="d-none d-md-block">The specs</h1>
          <p>
            Each Midnight Teddy is unique and programmatically generated from over 120 possible traits, including expression, headwear, clothing, and more. All Teddys are bad-ass, but some are rarer than others.
            <br/><br/>
            The Midnight Teddys are stored as SNIP-721 tokens on the Secret Network and hosted on IPFS. (See Record and Proof.) Purchasing a Midnight Teddy costs 21sScrt.
            <br/><br/>
            To access members-only areas such as The Secret Society, Teddy holders will need to be signed into their Keplr Wallet.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Specs
