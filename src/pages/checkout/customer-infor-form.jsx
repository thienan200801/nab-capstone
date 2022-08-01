import React from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import './style-customer-info.css';
import { Link } from "react-router-dom";
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import CartItem from './cart-item';
import GetFee from './fee';
import nikeLogo from '../imgsrc/nike-logo.png';

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
      id
    }
  }
`
const GET_CUSTOMER = gql`
  query Customer($customerId: ID!) {
    customer(customerId: $customerId) {
      id
      items {
        productId
        color
        size
        quantity
      }
      name
      location
    }
  }
`
const GET_PRODUCT_INFOR = gql`
  query GetProductInfor($productId: ID!) {
    product(id: $productId) {
      id
      name
      price
      pictures
    }
  }
`;


const CustomerInforForm = () => {
  const [updateCustomerInfo, resultUpdateCustomerInfo] = useMutation(UPDATE_CUSTOMER);
  const [GetCartItems, resultGetCustomer] = useLazyQuery(GET_CUSTOMER);
  const [GetItemInfo, ItemInfoResult] = useLazyQuery(GET_PRODUCT_INFOR);
  const [productsInCart, setProductsInCart] = useState([]);

  // table of product 
  const HandleGetCartItems = async () => {
    const CartItemsData = await GetCartItems({
      variables: {
        customerId: "nvp",
      },
      fetchPolicy:"no-cache"
    });
    const CartItems = CartItemsData.data.customer.items.map((item) => {
      return { id: item.productId, quantity: item.quantity, color:item.color};
    });

    // get product details infor
    let ProductDetails = [];
    for(let item of CartItems) {
      const detail = await GetItemInfo({
        variables:{
          productId: item.id,
        }
      });
      ProductDetails.push(detail.data);
    }

    // find name of cart item
    const products = CartItems.map((cartItem) => {
      const productDetail = ProductDetails.find(e=>e.product.id === cartItem.id);
      return { ...cartItem, ...productDetail.product };
    });


    let quantityItem = {};
    products.forEach((e) => {
      quantityItem[e.id] = quantityItem[e.id] ? (quantityItem[e.id] += e.quantity) : quantityItem[e.id]=e.quantity;
    });

    let finalRes = []
    for (let key in quantityItem) {
      const productDetail = products.find(e=>e.id === key);
      finalRes.push({id:key, ...productDetail,quantity:quantityItem[key]});
    }
    finalRes = finalRes.map((checkedItem)=>{
      let cartItem = productsInCart.find((e)=>e.id===checkedItem.id) || {};
      return {...checkedItem, checked: cartItem["checked"]};
    })
    setProductsInCart(finalRes);
  };

  useEffect(() => {
    HandleGetCartItems();
  }, []);


  const UpdateInfo = useCallback((values)=>{
    updateCustomerInfo({
      variables:{
        customer: {
          customerId: "nvp",
          name: values.name,
          location: values.address,
          items: [
            {
              productId: "b85b9193-7cdd-446b-acdf-263a60cac188",
              color: "white",
              size: "M",
              quantity: 7
            }
          ]
        }
      }
    }).then(()=>{
      resultGetCustomer.refetch()
    })
  }, [updateCustomerInfo])
  
  // handle validate 
  const validate = values => {
    console.log(values)
    const errors = {};
    if (!values.name) {
      errors.name = '* Required';
    } else if (values.name.length > 50) {
      errors.name = '* Must be 50 characters or less';
    }
  
    if (!values.province) {
      errors.province = '* Required';
    } else if (values.province.length > 20) {
      errors.province = '* Must be 20 characters or less';
    }
    
    if (!values.district) {
      errors.district = '* Required';
    } else if (values.district.length > 20) {
      errors.district = '* Must be 20 characters or less';
    }

    if (!values.address) {
      errors.address = '* Required';
    }
    
    return errors;
  };
  // render form 
  const formik = useFormik({
    initialValues: {
      name: resultGetCustomer.name,
      email: resultGetCustomer.email,
      phone: '',
      province: resultGetCustomer.location,
      district: '',
      address: ''
    },
    validate,
    onSubmit: values => {
      UpdateInfo(values)
    },
  });

  const [subTotal, setSubTotal] = useState(0);
  const [getLocation, setGetLocation] = useState('');
  
  function handleGetLocation(e){
    formik.handleChange(e);
    const result = productsInCart
            .map((product)=> product.price*product.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue,0)

    setSubTotal(result);
    setGetLocation(e.target.value);
  }
  return (
  <div className='customer-info-wrapper'>
    <form onSubmit={formik.handleSubmit}>
      <div className='header-wrapper'>
        <img src={nikeLogo} alt="Nike Logo" className='nike-logo'/>
        <h2 className='customer-infor-header'>THANH TOÁN</h2>
      </div>
      <label htmlFor="name">Họ tên</label>
      <input
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.name}
        className="form-control"
      />
      {formik.errors.name ? <div className='error'>{formik.errors.name}</div> : null}
      <br/>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        className="form-control"
      />
      <br/>
      <label htmlFor="phone">Số điện thoại</label>
      <input
        id="phone"
        name="phone"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.phone}
        className="form-control"
      />
      <br/>

      <div className="form-row">
        <div className="form-group col-md-6">
            <label htmlFor="province">Tỉnh/Thành phố</label>
            <input
              id="province"
              name="province"
              type="text"
              onChange={ (e) => {handleGetLocation(e)}}
              // onChange={formik.handleChange}
              value={formik.values.province}
              className="form-control"
            />
            {formik.errors.province ? <div className='error'>{formik.errors.province}</div> : null}
            <br/>
        </div>
        <div className="form-group col-md-6">
            <label htmlFor="district">Quận/ Huyện</label>
            <input
              id="district"
              name="district"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.district}
              className="form-control"
            />
            {formik.errors.district ? <div className='error'>{formik.errors.district}</div> : null}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="address">Số nhà</label>
        <input
          id="address"
          name="address"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.address}
          className="form-control"
        />
        {formik.errors.address ? <div className='error'>{formik.errors.address}</div> : null}
      </div>
      
      {/* table of order  */}
      <h3 className='form-order-title'>ĐƠN HÀNG CỦA BẠN</h3>
      <table className="table ">
        <thead className="header orderheader">
          <tr>
            <th scope="col" colSpan="2"></th>
            <th scope="col cart-item-content" style={{ width: 400 }}>
              Sản phẩm
            </th>
            <th scope="col" style={{ width: 150 }}>
              Phân loại
            </th>
            <th scope="col">Giá</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {productsInCart.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row" className="form-check">
                </th>
                <th scope="row">
                  <img src="" alt="" className="img-thumbnail cart-item-img" />
                </th>
                <th scope="row">{item.name}</th>
                <th scope="row">{item.categories || "Undefined"}</th>
                <th scope="row">{item.price}</th>
                <th scope="row quantity">{item.quantity}</th>
                <th scope="row">{item.price*item.quantity} <sup>đ</sup> </th>
              </tr>
            )
          })}
        </tbody>
      </table>
        
      <GetFee location={getLocation} subTotal={subTotal}/>
      
      {/* <div className='button-order'>
        <button class="btn btn-dark btn-lg d-1" type="submit" >ĐẶT HÀNG</button>
      </div> */}

      <Link to="/thanhcong" className="btn-order-content">
        <div className='button-order'>
          <button class="btn btn-dark btn-lg d-1" type="submit" >ĐẶT HÀNG</button>
        </div>
      </Link>
     
    </form>
  </div>
  );

};

export default CustomerInforForm;