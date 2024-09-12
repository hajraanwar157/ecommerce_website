import { ReactNavbar } from "overlay-navbar";
import logo from "../../../assets/logo.png";

import { CgShoppingCart, CgSearch } from "react-icons/cg";
import { TiUser } from "react-icons/ti";
import "./Header.css";
const options = {
  burgerColor: "#eb4034",
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  profileIcon: true,
  cartIcon: true,
  searchIcon: true,
  CartIconElement: CgShoppingCart,
  SearchIconElement: CgSearch,
  ProfileIconElement: TiUser,
  searchIconMargin: "5px",
  cartIconMargin: "5px",
  profileIconMargin: "5px",
  profileIconUrl: "/login",
  searchIconUrl: "/search",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;
