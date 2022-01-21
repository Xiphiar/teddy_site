import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const Welcome = () => {
  return (
    <Container>
      <Row>
      <h1 className="homeTitle">Welcome to the MTC club</h1>
      </Row>
      <Row className="justify-content-center">
        <Col className="poppins" md={6} xs={12}>
          
          <p className="homeStory">
            The Midnight Teddy Club (MTC) is a collection of up to 3030 Midnight Teddies which have formed a Society on the Secret Network. Each teddy is minted using SNIP-721 technology. This technology has the advantage of Private Smart Contracts giving owners the option to reveal their minted teddy or not. Initially, a Midnight Teddy can be acquired during the public sale. After that, the MTC owners can list their sNFT (secret-Non-fungible-token) on the Stashh.io platform.
            <br/><br/>
            The Secret Society of MTC owners is where inquisitive minds can come together from across the Cosmos. A unique club where owners can collaborate, assist and support each other's efforts in making the IBC thrive; we are the early adopters, WAGMI. 
            Whether you are interested in dApp development, NFT, Gamify, DeFi or Crypto in general, the Secret Society's goals are to provide a place and tools to help our community navigate the Metaverse.
            <br/><br/>
            Each MTC owner will mint an ALTER subscription giving them access to the platform via a 1-year subscription and 30GB storage. If a MTC Society member mints 10 Midnight Teddies, the ten (10) one year subscriptions can be turned into a lifetime perk* on ALTER. 
            Unique secret chat groups will be established for MTC owners.
          </p>
          <p className="footnote poppins">
            *manually assigned by MrFreeman
          </p>
        </Col>
        <Col>
        <Row className="justify-content-center align-items-center" style={{height: "100%"}}>
            <Col className="align-items-center" md={{span: 11, offset: 1}} xs={12}>
              <Image src="quad.png" fluid={true} />
              <p style={{width: "100%"}}>Note: 30 Midnight Teddy’s are “Parody” Teddys and based on some of the teams favourite characters.</p>
            </Col>

        </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Welcome
