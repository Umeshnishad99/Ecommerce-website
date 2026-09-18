import {Link, useNavigate} from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { clearTokens, getAccessToken } from '../Utils/auth';



function Navbar() {
    const {cartItems} = useCart();
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const isLoggedIn = !!getAccessToken();

    const handleLogout = () =>{
        clearTokens();
        navigate('/login');
    }
    return (
        <nav className="bg-amber-200 shadow-md px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-gray-800">E-Commerce</Link>

            <div className='flex items-center gap-6'>
                {/* Login/signup or Logout*/ }

                {!isLoggedIn ?(
                    <>
                    <Link to='/login' className='text-gray-800 hover:text-gray-600 font-medium'>
                        Login
                    </Link>
                    <Link to='/signup' className='text-gray-800 hover:text-gray-600 font-medium'>
                        SignUp
                    </Link>
                    </>
                ):(
                    <button onClick={handleLogout} className='text-gray-800 hover:text-gray-600 font-medium'>
                        Logout
                    </button>
                )}
            </div>

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