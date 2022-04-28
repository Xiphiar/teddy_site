import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LandingPage from './pages/LandingPage';
import { Gallery, WrappedGallery } from './pages/GalleryV2';
import MintPage from './pages/Mint';
import TeddyInfoPage from './pages/Teddy';
import SecretSociety from './pages/SecretSociety';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
      <Container fluid>
        <ToastContainer theme="colored"/>
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/home" element={<Home />} />
          <Route path="/team" element={<Home jumpto={"teamElement"} />} />
          <Route path="/roadmap" element={<Home jumpto={"roadmapElement"} />} />
          <Route path="/about" element={<Home jumpto={"roadmapElement"} />} />
        
          <Route path="/mint" element={<MintPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:lookupID" element={<WrappedGallery />} />
          <Route path="/showcase" element={<Gallery />} />
          <Route path="/secretsociety" element={<SecretSociety />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Container>
  );
};

export default App;
