// components
import Menu from "../components/Menu";
import Footer from "../components/Footer";

interface Props {
  children: any;
  home?: boolean;
}
const Layout = ({ children, home }: Props) => {
  return (
    <>
      <Menu home={home}/>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
