import { Container, Row, Col, Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import SocialLogos from './SocialLogos.js'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <>
      <footer className='text-center text-capitalize footerDiv'  style={{"marginTop": "50px", "paddingTop": "24px", "paddingBottom":"20px"}}>
        <Container fluid>
          <Row>

            <Col className="text-left" md={{span:4, offset:1}} sm={6}>
              <div className="emailForm">
                <Form className='d-flex align-items-end'>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{"paddingLeft":"20px"}}>Be with us</Form.Label>
                    <Form.Control type="email" placeholder="Be with us" className="emailBox"/>

                  </Form.Group>
                  <button type="submit" className="emailBtn">
                  ➜
                  </button>
                </Form>
              </div>
            </Col>

            <Col  md={{span:3}} className="d-none d-md-block">
              <Image src="logo.png" width="150px" className="d-block mx-auto img-fluid"/>
            </Col>

            <Col  md={3} sm={6}>
              <div style={{display: 'flex'}} className="justify-content-end">
              <SocialLogos />

              </div>
              <div style={{"paddingTop": "10px"}} className="copywright text-end">
                © 2022 MTC CLUB
              </div>
              <div style={{"paddingBottom": "10px"}} className="text-end termsLink">
                <a className="purpleText" href="terms.html">Terms</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer
