import {
  ADD_TO_CART_GUEST,
  ADD_TO_CART_USER,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  REMOVE_CART_ITEM_USER,
  SET_CART_USER_ITEMS,
} from "../constants/cartConstants";
import axios from "axios";
//adding items to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/v1/product/${id}`,
    {
      withCredentials: true,
    }
  );
  const { user } = getState().user;

  if (user) {
    dispatch({
      type: ADD_TO_CART_USER,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      },
    });
    localStorage.setItem(
      `cart-${user._id}`,
      JSON.stringify(getState().cart.cartItemsUser)
    );
  } else {
    dispatch({
      type: ADD_TO_CART_GUEST,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      },
    });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  }
};
//remove from cart
export const removeItemFromCart = (id) => async (dispatch, getState) => {
  const { user } = getState().user;

  if (user) {
    dispatch({
      type: REMOVE_CART_ITEM_USER,
      payload: id,
    });
    localStorage.setItem(
      `cart-${user._id}`,
      JSON.stringify(getState().cart.cartItemsUser)
    );
  } else {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  }
};

export const setCartUserItems = () => (dispatch, getState) => {
  const { user } = getState().user;

  if (user) {
    const cartItemsFromLocalStorage = localStorage.getItem(`cart-${user._id}`)
      ? JSON.parse(localStorage.getItem(`cart-${user._id}`))
      : [];

    // Dispatch action to update cartItemsUser in Redux store
    dispatch({
      type: SET_CART_USER_ITEMS,
      payload: cartItemsFromLocalStorage,
    });
  }
};

//save shipping information
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
