import React, { useEffect, useMemo, useState } from 'react';
import './ProductList.scss';
import Product from './Product/Product';

const products = [
  { id: 1, stocked: 'true', name: "ZoomX Invincible Run Flyknit 2", description: "Men's Road Running Shoes", category: "Men", price: 500, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5b3769cc-b1a2-4927-9368-1294727191fa/zoomx-invincible-run-flyknit-2-road-running-shoes-xrCMmF.png" },
  { id: 2, stocked: 'false', name: "ZoomX Invincible Run Flyknit 2", description: "Women's Road Running Shoes", category: "Women", price: 1000, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8ec527c9-4354-4382-bb4f-a8dfe55ab50e/zoomx-invincible-run-flyknit-2-road-running-shoes-0lCQ5S.png" },
  { id: 3, stocked: 'false', name: "Air Zoom Pegasus 39", description: "Men's Road Running Shoes", category: "Men", price: 1000, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/57dd56da-b069-4c63-bece-4810c1067215/air-zoom-pegasus-39-road-running-shoes-kmZSD6.png" },
  { id: 4, stocked: 'true', name: "Air Zoom Pegasus 39", description: "Women's Road Running Shoes", category: "Women", price: 700, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8ac8f22d-a9af-4255-aa79-5c83e73a0757/air-zoom-pegasus-39-road-running-shoes-0ksHjP.png" },
  { id: 5, stocked: 'false', name: "Flex Plus", description: "Older Kids' Road Running Shoes", category: "Kids", price: 800, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/cae9f806-0eb4-4134-891e-5b3c6815a2bf/flex-plus-older-road-running-shoes-mwbkdj.png" },
  { id: 6, stocked: 'true', name: "Air Zoom Arcadia 2", description: "Younger Kids' Shoes", category: "Kids", price: 300, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9692dd73-ea46-4bf5-bffd-a1c7048ec167/air-zoom-arcadia-2-younger-shoes-z8v8X7.png" },
  { id: 7, stocked: 'true', name: "React Infinity Run Flyknit 3", description: "Men's Road Running Shoes", category: "Men", price: 250, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e3cdacc8-7b04-42d3-a0c3-bc48772b9276/react-infinity-run-flyknit-3-road-running-shoes-S5Srkq.png" },
  { id: 8, stocked: 'false', name: "React Infinity Run Flyknit 3", description: "Women's Road Running Shoes", category: "Women", price: 1200, image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/34487906-4d7e-428a-aed0-7ac6119e427a/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png" },
]

const ShowProducts = () => {
  const [ productList, setProductList ] = useState([]);
  const [ price, setPrice ] = useState(0);
  const [ selectedCategory, setSelectedCategory ] = useState();
  const [ sortProduct, setSortProduct ] = useState();

  useEffect(() => setProductList(products), []);

  let filteredList = useMemo(() => {
    if (!selectedCategory) {
        return productList;
    }
    return productList.filter(product => product.category === selectedCategory); 
  }, [selectedCategory, productList]);


  filteredList = useMemo(() => {
    if (price !== 0) {
      return filteredList.filter(product => product.price >= parseInt(price, 10));
    }
    return filteredList;
  }, [price, filteredList]);


  filteredList = useMemo(() => {
    if (sortProduct === 'ASC') {
      return filteredList.sort((a, b) => a.price - b.price);
    }
    if (sortProduct === 'DESC') {
      return filteredList.sort((a, b) => b.price - a.price);
    }
    if (sortProduct === 'A-Z') {
      return filteredList.sort((a, b) => a.name > b.name ? 1 : -1);
    }
      return filteredList.sort((a, b) => a.name > b.name ? -1 : 1);
  }, [sortProduct, filteredList]);

  
  return (
    <div className='filter-products'>
      <div className='filter'>
        <span>Category</span>
        <div className='category'>
          <div className='option' onClick={() => setSelectedCategory()}>All</div>
          <div className='option' onClick={() => setSelectedCategory('Men')}>Men</div>
          <div className='option' onClick={() => setSelectedCategory('Women')}>Women</div>
        </div>

        <span className='price'>Price: <span style={{ color: "crimson" }}>${price}</span></span>
        <div className='price-container'>
          <input type="range" min='0' max='2000' className='slider' onChange={e => setPrice(e.target.value)} />
        </div>

        <div className='sort-product'>
          <span className='sort'>Sort by price</span>
          <div className='option' onClick={() => setSortProduct('ASC')}>Low to High</div>
          <div className='option' onClick={() => setSortProduct('DESC')}>High to Low</div>

          <span className='sort'>Sort by name</span>
          <div className='option' onClick={() => setSortProduct('A-Z')}>From A to Z</div>
          <div className='option' onClick={() => setSortProduct('Z-A')}>From Z to A</div>
        </div>
      </div>
      <ul className='product-list'>
        { filteredList.map(product => (
          <li key={product.id}>
            <Product product={product}/>   
          </li>
        ))}
      </ul>
    </div>
  )
}

const Products = () => {
  return (
    <div className='products'>
      <div className='banner'> 
        <h2>#stayhome</h2>
        <p>Save more with coupons &amp; up to 70% off!</p>
      </div>
      <ShowProducts />
    </div>
  )
}

const FeatureProducts = () => {
  return (
    <div className='products'>
      <div className='header'>
        <h2>Feature Products</h2>
        <p>Summer Collection New Modern Design</p>
      </div>
      <ul className='product-list'>
        { products.slice(0, 4).map(product => (
          <li key={product.id}>
            <Product product={product}/>   
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Products;
export { FeatureProducts };