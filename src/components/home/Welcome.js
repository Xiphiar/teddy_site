import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Welcome = () => {
  return (
    <Container>
      <Row>
        <Col className="poppins">
        <h1 className="homeTitle">Welcome to the MTC club</h1>
        <p className="homeStory">
          The Midnight Teddy Club is a collection of up to 3030 Teddies that are part of the secret society from Secret Network. Each teddy is minting using SNIP-721 technology that gives the advantage of privacy and option to reveal the minted teddy or not. The teddy can be acquired during the public sale. After that the teddy owners can list their sNFT (secret-Non-functionlal-token) on Stashh.io application 
          <br/><br/>
          The Secret Society of MTC owners is where all the brightest minds come together from across the Cosmos Ecosystem. A unique club where owners can collaborate, assist and support each others effort on Cosmos either it is a dApp development, NFT, Gamify, DeFi and more.
          <br/><br/>
          Each MTC owner will mint an ALTER subscription and access to the platform with a 1-year subscription and 30GB storage. Owning 10 of MTCs teddies the one year subscriptions can be turned into lifetime perk* on ALTER. Unique secret chat groups will be established for MTC owners.
          </p>
          <p className="footnote poppins">
          *manually assigned by MrFreeman
        </p>
        </Col>

        <Col>
          <Row className="justify-content-center">
            <Col style={{"paddingLeft":"30px"}}><Image src="quad.png" /></Col>
          </Row>
          <Row>
            <Col style={{"paddingLeft":"40px", "paddingTop":"20px"}} md={{ span: 10}}>
              <span>Note: 30 Midnight Teddy’s are “Parody” Teddys and based on some of the teams favourite characters.</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Welcome
