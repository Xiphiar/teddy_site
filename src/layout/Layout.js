// components
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const Layout = ({ children, home }) => {
  return (
    <>
      <Menu home={home}/>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
