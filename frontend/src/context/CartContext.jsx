import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    //fetch Cart from Backend 
    const fetchCart = async () => {
        try {
            const res = await fetch(`${BASEURL}/api/cart`)
            if (!res.ok) {
                throw new Error("Falied to Fetch cart");
            }
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
        }
        catch (error) {
            console.error("Error Fetching cart:", error);
        }
    }

    useEffect(()=>{
        fetchCart();
    }, []);

    // Add Product to Cart
    const addToCart = async (productId) => {
        try{
            await fetch(`${BASEURL}/api/cart/add/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({product_id :productId}),
            });
            fetchCart();
        }
        catch(error){
            console.error("Error adding to Cart:",error)
        }
    }

    //Remove Product from Cart
    const removeFromCart = async (ItemId)=>{
        try{
            await fetch(`${BASEURL}/api/cart/remove/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({item_id:ItemId}),

            });
            fetchCart();
        }
        catch(error)
        {
            console.error("error while removing the item from Cart:",error)
        }
    }

    //Update Quantity
    const updateQuantity = async(Itemid, quantity) => {
        if(quantity < 1){
            await removeFromCart(items)
            return;
        }
        try{
            await fetch(`${BASEURL}/api/cart/update`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({item_id:Itemid,quantity}),

            });
            fetchCart();
        }
        catch(error){
            console.log("Error while Updating the Cart:", error)
        }
    };

    const clearCart = () =>{
        setCartItems([]);
        setTotal(0);
    }

    return (
        <CartContext.Provider
            value={{ cartItems,total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);