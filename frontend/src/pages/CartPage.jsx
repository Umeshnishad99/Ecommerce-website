import  {useCart} from '../context/CartContext';

function CartPage() {
    const {cartItems,total, removeFromCart, updateQuantity} = useCart();
    const BASEURL =  import.meta.env.VITE_DJANGO_BASE_URL
    console.log("cart item:",cartItems);

    return (
        <div className="pt-20 min-h-screen bg-gray-100 p-8 justify-center">
            <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-600 text-lg">Your cart is empty.</p>
            ) : (
                <div className="bg-amber-50 p-6 rounded-lg shadow-md max-w-4xl text-center">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-4">
                            <div className='flex item-center gap-4'>
                                { item.product_image && (
                                    <img src = {`${BASEURL}${item.product_image}`}
                                    alt={item.product_image}
                                    className='w-20 h-20 object-cover rounded'
                                    />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{item.product_name}</h2>
                                <p className="text-gray-600">${item.product_price}</p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="bg-gray-300 text-gray-700 py-1 px-3 rounded-l hover:bg-gray-400"
                                >
                                    -
                                </button>
                                <span className="bg-gray-200 text-gray-700 py-1 px-3">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="bg-gray-300 text-gray-700 py-1 px-3 rounded-r hover:bg-gray-400"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                    >Remove</button>
                            </div>
                        </div>
                    ))}

                    <div className ="border-t pt-4 mt-4 flex justify-between item-center">
                        <h2 className="text-xl font-bold">Total:</h2>
                        <p className="text-xl font-semibold">${total.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;