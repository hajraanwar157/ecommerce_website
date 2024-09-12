import {
  ADD_TO_CART_USER,
  ADD_TO_CART_GUEST,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  REMOVE_CART_ITEM_USER,
  SET_CART_USER_ITEMS,
  EMPTY_SHIPPING_INFO,
} from "../constants/cartConstants";
export const cartReducer = (
  state = { cartItems: [], cartItemsUser: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART_GUEST:
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case ADD_TO_CART_USER:
      const itemUser = action.payload;
      const isItemExistUser = state.cartItemsUser.find(
        (i) => i.product === itemUser.product
      );
      if (isItemExistUser) {
        return {
          ...state,
          cartItemsUser: state.cartItemsUser.map((i) =>
            i.product === isItemExistUser.product ? itemUser : i
          ),
        };
      } else {
        return {
          ...state,
          cartItemsUser: [...state.cartItemsUser, itemUser],
        };
      }
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };
    case REMOVE_CART_ITEM_USER:
      return {
        ...state,
        cartItemsUser: state.cartItemsUser.filter(
          (i) => i.product !== action.payload
        ),
      };
    case SET_CART_USER_ITEMS:
      return {
        ...state,
        cartItemsUser: action.payload,
      };
    case EMPTY_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: [],
      };
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};
