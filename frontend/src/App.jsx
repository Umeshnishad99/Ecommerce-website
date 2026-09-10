import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetails'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App