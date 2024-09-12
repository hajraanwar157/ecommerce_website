import "./Footer.css";
import playStore from "../../../assets/playstore.png";
import appstore from "../../../assets/Appstore.png";

function Footer() {
  return (
    <>
      <footer id="footer">
        <div className="left-footer">
          <h4>DOWNLOAD OUR APP</h4>
          <p>Download App for Android and IOS mobile phone</p>
          <img src={playStore} alt="" />
          <img src={appstore} alt="" />
        </div>
        <div className="mid-footer">
          <h1>ECOMMERCE</h1>
          <p>High quality is our first priority</p>
          <p>Copyrights 2024 &copy; HajraAnwar</p>
        </div>
        <div className="right-footer">
          <h4>Follow us</h4>
          <a href="http://instagram.com">Instagram</a>
          <a href="http://youtube.com">Youtube</a>
          <a href="http://facebook.com">Facebook</a>
        </div>
      </footer>
    </>
  );
}

export default Footer;
