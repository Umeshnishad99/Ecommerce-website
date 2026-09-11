import {createContext, useContext, useState} from "react";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);

    // Add Product to Cart
    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if(existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? {...item, quantity: item.quantity + 1} : item
            ));
        } else {
            setCartItems([...cartItems, {...product, quantity: 1}]);
        }
    };

    //Remove Product from Cart
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    //Update Quantity
    const updateQuantity = (id, quantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? {...item, quantity: quantity} : item
        ));
    };

    return (
        <CartContext.Provider 
        value={{cartItems, addToCart, removeFromCart, updateQuantity}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () =>  useContext(CartContext);