import './App.css';
import { Owner } from './pages/owner';
import ProductDetail from './pages/browser/components/Products/ProductDetail/ProductDetail';
import Products, { FeatureProducts } from './pages/browser/components/Products/ProductList';

function App() {
  return <div className="app">
    <Products />
    <FeatureProducts />
    <ProductDetail />
  </div>
}

export default App;
