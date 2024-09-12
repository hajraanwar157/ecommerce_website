import MetaData from "../Layout/MetaData";
import "./Home.css";
import ProductCard from "./ProductCard";
import { clearErrors, getProduct } from "../../actions/ProductAction";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Loader from "../Layout/Loader/Loader";
import { toast } from "react-toastify";

function Home() {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="ECOMMERCE" />
          <div className="banner">
            <p>Welcome to ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#product-container">
              <button>Scroll</button>
            </a>
          </div>
          <h2 className="home-heading">Featured Products</h2>
          <div className="product-container" id="product-container">
            {products &&
              products.map((product, index) => (
                <ProductCard product={product} key={index}></ProductCard>
              ))}
          </div>
        </>
      )}
    </>
  );
}

export default Home;
