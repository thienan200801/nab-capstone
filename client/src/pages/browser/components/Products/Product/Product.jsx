import React from 'react';
import './Product.scss';

const Product = ({ product }) => {
  return (
    <a href='#' className='product'>
      <img src={product.image} alt='Nike Shoes' />
      <div className='info'>
        <div className='description'>{product.description}</div>
        <h5 className='name'>Nike {product.name}</h5>
        <div className='price'>${product.price}</div>
      </div>
      <button className='add'>Add to Bag</button>
    </a>
  )
}

export default Product;