
import React from 'react'; 
import Meta from '../components/Meta' 
import { Container, Row } from "react-bootstrap"; 
import Layout from "../layout/Layout";
import SecretSocietyCard from '../components/secretsociety/SecretSocietyCard';

class SecretSociety extends React.Component {
    render () {
        const pageTitle = 'Midnight Teddy Club'
        return ( 
            <Layout>
                <Meta title={pageTitle}/>
                <Container>
                    <Row>
                        <h1 className="homeTitle">Midnight Teddy Clubhouse</h1>
                    </Row>
                    <SecretSocietyCard></SecretSocietyCard>
                </Container>
            </Layout>
        )
    }
}

export default SecretSociety