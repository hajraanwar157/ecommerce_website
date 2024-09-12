import "./Contact.css";
import { Button } from "@mui/material";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:hajraanwar157@gmail.com">
        <Button>Contact: hajraanwar157@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
