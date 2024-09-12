import { Avatar, Button, Typography } from "@mui/material";
import "./About.css";

import { Instagram, YouTube } from "@mui/icons-material";
function About() {
  const visitInstagram = () => {
    window.location = "https://instagram.com";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dbgqzpxbq/image/upload/v1726058479/profileImg_n9bryi.jpg"
              alt="Founder"
            />
            <Typography>Hajra Anwar</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by me (hajra anwar). Only with the
              purpose of learning mern stack.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Follow us on</Typography>
            <a href="https://www.youtube.com" target="blank">
              <YouTube className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com" target="blank">
              <Instagram className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
