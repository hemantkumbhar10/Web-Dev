import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if(action.type === "CLEAR"){
    return defaultCartState;
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  //the cartState gives you simply a current state which conatins all current data.
  //the dispatchCartAction is a simply a function which recieves parameters which are used in manually created reducer function outside the component.
  //i.e. cartReducer(). This function recieves data dipatched through dispatch funtion and returns new values by manupulating them.

  //The dispatch function usually can take any value. but its better to provide object, because itll be easy to use in complex data dispacthing and using conditions.
  //we can add key value pairs in that object, hence for specific action.
  //for exaple. we can have multiple actions in real world
  //here for example, ADD and REMOVE actions
  //we can specify them in key value pairs
  //hence we can work on them conditionally which eventually returns updated items
  //for that, the cartReducer function which is created outside the component needs to be given as argument to useReducer().
  //The useReducer takes two arguments, first is the reducer Function from outside world and second is default value.
  //hence the react automatically asssigns new updated values from reducer function to the cartState as current snap of state.

  //finally we create a varible which holds the value from cartState and can use it anywhere.
  //if its in context then it can be delivered through "value".
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };
  
  const clearCartHandler = () =>{
    dispatchCartAction({type:'CLEAR'});
  };


  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart:clearCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
