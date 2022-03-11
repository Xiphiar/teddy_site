import { Container, Row, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import RoadmapItem from './RoadmapItem'

const item1 = ["3030 Midnight Teddy’s Minted.",<br/>,"AlterDapp Lifetime membership accounts distributed."]
const item2 = ['“The Factory” Is opened and evolutionary reconstruction begins.',<br/>,'Midnight Teddys retired to “The Club” are viewable in our “Burn Gallary”.']
const item3 = ["Dynamic trait rarity tracker",<br/>,"Stashh used as secondary market place"]
const item4 = ["First NFT airdrop to all MTC holders - Secret Society Emblems"]
const item5 = '1/1 Traits auctioned on Stashh to be used in “The factory”'
const item6 = "Midnight Teddy Club DAO"

const Roadmap = () => {
  return (
    <Container>
      <Row>
        <h1>MTC phased plan</h1>
        <p>
          No “Rug-pulls” here we are in it for the long-haul!  We want to reward our community and MTC Hodlers.
          <br/>Here are a few of our post minting goals: 
          <br/><br/>
          (These will be crossed out as they are achieved).
        </p>
      </Row>
      <Row className="align-items-center" style={{"paddingTop":"20px"}}>

        <Col md={{ span: 8}} style={{"paddingLeft":"0"}} xs={12}>
          <RoadmapItem number={"1"} text={item1}/>
          <RoadmapItem number={"2"} text={item2}/>
          <RoadmapItem number={"3"} text={item3}/>
          <RoadmapItem number={"4"} text={item4}/>
          <RoadmapItem number={"5"} text={item5}/>
          <RoadmapItem number={"6"} text={item6}/>
        </Col>
        <Col md={{ span: 4}} className="align-items-center justify-content-center ">
          <div className="my-auto">
            <Image src="roadmapteddy.png" className="d-block mx-auto img-fluid" fluid/>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Roadmap
