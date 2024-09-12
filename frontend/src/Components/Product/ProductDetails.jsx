import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/ProductAction";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Layout/Loader/Loader";
import ReviewCard from "./ReviewCard.jsx";
import Carousel from "react-bootstrap/Carousel";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData.jsx";
import { addItemsToCart } from "../../actions/cartActions.jsx";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Rating } from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants.jsx";
function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };
  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    toast.success("item added to cart");
  };
  const submitReview = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const submitReviewHandler = () => {
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);
    dispatch(newReview(myForm));
    setOpen(false);
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review submitted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, toast, id, error, reviewError, success]);

  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name}-ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="CarouselImage"
                        src={item.url}
                        alt={`${index} Slide`}
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="details-block">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  ( {product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`Rs.${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly value={quantity} type="number" />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b
                    className={`${
                      product.stock < 1 ? "red-color" : "green-color"
                    }`}
                  >
                    {product.stock < 1 ? " Out of stock" : "Instock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description: <p>{product.description}</p>
              </div>
              <button onClick={submitReview} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="review-heading">REVIEWS</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReview}
          >
            <DialogTitle>Submit review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReview} color="secondary">
                Cancel
              </Button>
              <Button color="primary" onClick={submitReviewHandler}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
            </div>
          ) : (
            <p className="noreviews">No Reviews yet</p>
          )}
        </>
      )}
    </>
  );
}

export default ProductDetails;
