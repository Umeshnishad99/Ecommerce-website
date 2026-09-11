import {Link} from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
    const {cartItems} = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-gray-800">E-Commerce</Link>
            <Link to="/cart" className="text-gray-800 hover:text-gray-600 relative">
                Cart {cartCount > 0 && (
                    <span className="rounded-full px-2 font-bold text-xs absolute -top-2 -right-2 bg-red-500 text-white">
                        {cartCount}
                    </span>
                )}
            </Link>
        </nav>
    )
}

export default Navbar