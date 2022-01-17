import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Specs = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Image src="specsteddy.png" />
        </Col>
        <Col>
          <h1>The specs</h1>
          <p>
            Each Midnight Teddy is unique and programmatically generated from over 120 possible traits, including expression, headwear, clothing, and more. All Teddys are bad-ass, but some are rarer than others.
            <br/><br/>
            The Midnight Teddys are stored as SNIP-721 tokens on the Secret Network and hosted on Arweave. (See Record and Proof.) Purchasing a Midnight Teddy costs 21sScrt.
            <br/><br/>
            To access members-only areas such as The Secret Society, Teddy holders will need to be signed into their Keplr Wallet.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Specs
