import React from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import "./style-customer-info.css";
import { Link } from "react-router-dom";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import CartItem from "./cart-item";
import GetFee from "./fee";
import nikeLogo from "../imgsrc/nike-logo.png";
import CheckoutInfoForm from "./checkout-info-form";

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
      id
    }
  }
`;
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
`;
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
  const [updateCustomerInfo, resultUpdateCustomerInfo] =
    useMutation(UPDATE_CUSTOMER);
  const [GetCartItems, resultGetCustomer] = useLazyQuery(GET_CUSTOMER);
  const [GetItemInfo, ItemInfoResult] = useLazyQuery(GET_PRODUCT_INFOR);
  const [productsInCart, setProductsInCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});

  // table of product
  const HandleGetCartItems = async () => {
    const CartItemsData = await GetCartItems({
      variables: {
        customerId: "nvp",
      },
      fetchPolicy: "no-cache",
    });
    const CartItems = CartItemsData.data.customer.items.map((item) => {
      return { id: item.productId, quantity: item.quantity, color: item.color };
    });

    console.log("cart items data", CartItemsData.data.customer);
    setCustomerInfo(CartItemsData.data.customer);

    // get product details infor
    let ProductDetails = [];
    for (let item of CartItems) {
      const detail = await GetItemInfo({
        variables: {
          productId: item.id,
        },
      });
      ProductDetails.push(detail.data);
    }

    // find name of cart item
    const products = CartItems.map((cartItem) => {
      const productDetail = ProductDetails.find(
        (e) => e.product.id === cartItem.id
      );
      return { ...cartItem, ...productDetail.product };
    });

    let quantityItem = {};
    products.forEach((e) => {
      quantityItem[e.id] = quantityItem[e.id]
        ? (quantityItem[e.id] += e.quantity)
        : (quantityItem[e.id] = e.quantity);
    });

    let finalRes = [];
    for (let key in quantityItem) {
      const productDetail = products.find((e) => e.id === key);
      finalRes.push({ id: key, ...productDetail, quantity: quantityItem[key] });
    }
    finalRes = finalRes.map((checkedItem) => {
      let cartItem = productsInCart.find((e) => e.id === checkedItem.id) || {};
      return { ...checkedItem, checked: cartItem["checked"] };
    });
    setProductsInCart(finalRes);
  };

  useEffect(() => {
    HandleGetCartItems();
  }, []);

  const UpdateInfo = useCallback(
    (values) => {
      updateCustomerInfo({
        variables: {
          customer: {
            customerId: "nvp",
            name: values.name,
            location: values.address,
            items: [
              {
                productId: "b85b9193-7cdd-446b-acdf-263a60cac188",
                color: "white",
                size: "M",
                quantity: 7,
              },
            ],
          },
        },
      }).then(() => {
        resultGetCustomer.refetch();
      });
    },
    [updateCustomerInfo]
  );

  // handle validate
  const validate = (values) => {
    console.log(values);
    const errors = {};
    if (!values.name) {
      errors.name = "* Required";
    } else if (values.name.length > 50) {
      errors.name = "* Must be 50 characters or less";
    }

    if (!values.province) {
      errors.province = "* Required";
    } else if (values.province.length > 20) {
      errors.province = "* Must be 20 characters or less";
    }

    if (!values.district) {
      errors.district = "* Required";
    } else if (values.district.length > 20) {
      errors.district = "* Must be 20 characters or less";
    }

    if (!values.address) {
      errors.address = "* Required";
    }

    return errors;
  };
  // render form
  const formik = useFormik({
    initialValues: {
      name: resultGetCustomer.name,
      email: resultGetCustomer.email,
      phone: "",
      province: resultGetCustomer.location,
      district: "",
      address: "",
    },
    validate,
    onSubmit: (values) => {
      UpdateInfo(values);
    },
  });

  const [subTotal, setSubTotal] = useState(0);
  const [getLocation, setGetLocation] = useState("");

  function handleGetLocation(e) {
    // formik.handleChange(e);
    const result = productsInCart
      .map((product) => product.price * product.quantity)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    setSubTotal(result);
    setGetLocation(e.target.value);
  }
  return (
    <div className="customer-info-wrapper">
      <CheckoutInfoForm
        customerInfo={customerInfo}
        handleGetLocation={handleGetLocation}
        productsInCarts={productsInCart}
        getLocation={getLocation}
        subTotal={subTotal}
        updateInfo={UpdateInfo}
      />
    </div>
  );
};

export default CustomerInforForm;
