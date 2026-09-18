import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../Utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL =
        import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch Cart from Backend
    const fetchCart = async () => {
        const token = getAccessToken();

        // Don't call cart API if user is not logged in
        if (!token) {
            setCartItems([]);
            setTotal(0);
            return;
        }

        try {
            const res = await authFetch(`${BASEURL}/api/cart/`);

            if (res.status === 401) {
                setCartItems([]);
                setTotal(0);
                return;
            }

            const data = await res.json();

            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error Fetching cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Add Product to Cart
    const addToCart = async (productId) => {
        const token = getAccessToken();

        if (!token) {
            console.log("Please login first");
            return;
        }

        try {
            await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({
                    product_id: productId,
                }),
            });

            fetchCart();
        } catch (error) {
            console.error("Error adding to Cart:", error);
        }
    };

    // Remove Product from Cart
    const removeFromCart = async (ItemId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: ItemId,
                }),
            });

            fetchCart();
        } catch (error) {
            console.error(
                "Error while removing the item from Cart:",
                error
            );
        }
    };

    // Update Quantity
    const updateQuantity = async (Itemid, quantity) => {
        if (quantity < 1) {
            await removeFromCart(Itemid);
            return;
        }

        try {
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({
                    item_id: Itemid,
                    quantity: quantity,
                }),
            });

            fetchCart();
        } catch (error) {
            console.log("Error while Updating the Cart:", error);
        }
    };

    // Clear Cart
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);