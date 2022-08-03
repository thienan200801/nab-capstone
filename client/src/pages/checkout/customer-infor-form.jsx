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

const UPDATE_PRODUCT = gql`
  mutation Mutation($product: UpdateProductInput!) {
    updateProduct(product: $product) {
      id
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

const CustomerInforForm = ({ checkoutItems }) => {
  const [updateCustomerInfo, resultUpdateCustomerInfo] =
    useMutation(UPDATE_CUSTOMER);
  const [updateStock, resultUpdateStock] = useMutation(UPDATE_PRODUCT);
  const [GetCartItems, resultGetCustomer] = useLazyQuery(GET_CUSTOMER);
  const [customerInfo, setCustomerInfo] = useState({});

  const fetchCustomerInfo = async () => {
    const customer = await GetCartItems({
      variables: {
        customerId: "nvp",
      },
      fetchPolicy: "no-cache",
    });
    console.log("customer infor fetch", customer);
    setCustomerInfo(customer.data.customer);
  };

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const checked_items = checkoutItems.filter((item) => item.checked);

  const handleUpdateStock = () => {
    checked_items.forEach((item) => {
      if (item.checked) {
        updateStock({
          variables: {
            product: {
              id: item.id,
              stock: item.max_number - item.quantity,
            },
          },
        });
      }
    });
  };

  const UpdateInfo = useCallback(
    (values) => {
      const new_cart = [];
      console.log("update infor",checkoutItems);
      const items = checkoutItems.forEach((item) => {
        if (!item.checked) {
          new_cart.push({
            productId: item.id,
            color: item.color,
            quantity: item.quantity,
          });
        }
      });

      console.log("update info", new_cart);

      updateCustomerInfo({
        variables: {
          customer: {
            customerId: "nvp",
            name: values.name,
            location: values.address,
            items: new_cart
          },
        },
      }).then(() => {
        handleUpdateStock();
        resultGetCustomer.refetch();
      });
    },
    [updateCustomerInfo, checkoutItems]
  );

  const [subTotal, setSubTotal] = useState(0);
  const [getLocation, setGetLocation] = useState("");

  function handleGetLocation(e) {
    // formik.handleChange(e);
    const result = checkoutItems
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
        checkoutItems={checked_items}
        getLocation={getLocation}
        subTotal={subTotal}
        updateInfo={UpdateInfo}
      />
    </div>
  );
};

export default CustomerInforForm;
