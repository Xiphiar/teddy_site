// components
import Menu from "../components/LandingMenu";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
