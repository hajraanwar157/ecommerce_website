import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import MetaData from "../Layout/MetaData";
function Search({}) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <MetaData title="Search a product-ECOMMERCE"></MetaData>
      <form className="searchbox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a product..."
          onChange={(event) => {
            setKeyword(event.target.value);
          }}
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
}

export default Search;
