import profilepng from "../../assets/Profile.png";
import { Rating } from "@mui/material";

function ReviewCard({ review }) {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div className="review-card">
      <img src={profilepng} alt="profile-img" />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardSpan">{review.comment}</span>
    </div>
  );
}

export default ReviewCard;
