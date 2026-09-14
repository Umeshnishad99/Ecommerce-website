import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetails'
import Navbar from './components/Navbar'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckOutPage'

function App() {
  return (
    
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage/>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
        </Routes>
    </Router>
  )
}

export default App