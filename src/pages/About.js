import Header from '../components/Header'
import Meta from '../components/Meta'

// Layout
import Layout from "../layout/Layout";


const About = () => {
  // page content
  const pageTitle = 'Midnight Teddy Club'
  const pageDescription = 'welcome to react bootstrap template'

  return (
    <Layout>
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
    </div>
    </Layout>
  )
}

export default About