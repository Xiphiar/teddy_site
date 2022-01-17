import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LandingPage from './pages/LandingPage';
import Gallery from './pages/Gallery';

const App = () => {
  return (
      <Container fluid>
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/home" element={<Home />} />
          <Route path="/team" element={<Home jumpto={"teamElement"} />} />
          <Route path="/roadmap" element={<Home jumpto={"roadmapElement"} />} />
          <Route element={<NotFound />} />
        </Routes>
      </Container>
  );
};

export default App;
