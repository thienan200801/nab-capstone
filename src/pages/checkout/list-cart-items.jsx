import React, { useCallback, useEffect } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useState } from "react";
import CartItem from "./cart-item";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./style-list-cart-items.css";
import logo from "../imgsrc/Logo_NIKE.svg.png";
import Modal from "./modalCheckout";

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const GET_LIST_CART_ITEMS = gql`
  query GetListCartItems($customerId: ID!) {
    customer(customerId: $customerId) {
      items {
        productId
        quantity
        color
      }
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

const UPDATE_CART = gql`
  mutation UpdateCart($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
      id
    }
  }
`;

export function ListCartItems() {
  const [productsInCart, setProductsInCart] = useState([]);
  const [GetCartItems, CartItemsResult] = useLazyQuery(GET_LIST_CART_ITEMS);
  const [GetItemInfo, ItemInfoResult] = useLazyQuery(GET_PRODUCT_INFOR);
  const [HandleUpdateCart, CartAfterUpdate] = useMutation(UPDATE_CART);
  let navigate = useNavigate();

  const updateCart = async (id, newQuantity) => {
    console.log("update Cart", newQuantity);

    const newCartItems = productsInCart.map((product) => {
      if (product.id === id) {
        if (newQuantity > 0) {
          return {
            productId: id,
            quantity: newQuantity,
            color: product.color,
          };
        } else if (newQuantity === 0) {
          if (window.confirm("Remove?"))
            return {
              productId: id,
              quantity: newQuantity,
              color: product.color,
            };
        }
      }
      return {
        productId: product.id,
        quantity: product.quantity,
        color: product.color,
      };
    });

    console.log(newCartItems);

    const res = HandleUpdateCart({
      variables: {
        customer: {
          items: newCartItems,
          customerId: "nvp",
        },
      },
    }).then(() => {
      // CartItemsResult.refetch();
      HandleGetCartItems();
    });
  };

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

  // total
  const [subToTal, setSubTotal] = useState(0);

  function handleChooseItem(item) {

    let countIsChecked = 0; 

    let newProductsInCart = productsInCart.map((product) => {
      if (product.id === item.id) {
        let new_product = { ...product };
        if (new_product["checked"]) {
          new_product["checked"] = false;
        } else {
          new_product["checked"] = true;
          countIsChecked++;
        }
        return new_product;
      } else {
        if(product['checked'] === true) countIsChecked++;
        return { ...product };
      }
    });

    console.log(countIsChecked);
    if (countIsChecked === productsInCart.length) handleSelectAll(true);
    else setSelectAll(false);

    setProductsInCart(newProductsInCart);
  }

  function handleSubTotal() {
    let tmpSubtotal = 0;
    productsInCart.map((product) => {
      return product.checked
        ? (tmpSubtotal += product.price * product.quantity)
        : tmpSubtotal;
    });
    setSubTotal(tmpSubtotal);
  }

  useEffect(() => {
    handleSubTotal();
  }, [productsInCart]);

  function handleCheckBeforeClick() {
    if (!subToTal) return alert("Please choose items before next step!");
    else {
      navigate("../thanhtoan");
    }
  }

  const [selectAll, setSelectAll] = useState(false);

  function handleSelectAll(value) {
    let allProducts = productsInCart.map((product) => {
      let new_product = { ...product };
      new_product["checked"] = value;
      return new_product;
    });
    setProductsInCart(allProducts);
    setSelectAll(value);
  }

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* navbar section  */}
      {/* <AlertMessage isOpen={isOpenAlert}/> */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link active" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
            <a className="nav-item nav-link" href="#">
              Features
            </a>
            <a className="nav-item nav-link" href="#">
              Pricing
            </a>
            <a className="nav-item nav-link disabled" href="#">
              Disabled
            </a>
          </div>
        </div>
      </nav>

      {/* main content section */}
      <div className="cart-wrapper">
        <div className="list-cart-header">
          <div className="list-cart-header-left">
            <img src={logo} alt="" className="logo" />
            <h2 className="cart-title">GIỎ HÀNG</h2>
          </div>
          <div className="list-cart-header-right">
            <Link to="/" className="btn-order-content">
              <button
                className="btn btn-dark btn-m inverted-8 openModalBtn"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                TIẾP TỤC MUA HÀNG
              </button>
              {modalOpen && <Modal setOpenModal={setModalOpen} />}
            </Link>
          </div>
        </div>

        <table className="table container">
          <thead className="thead-light header">
            <tr>
              <th scope="col" colSpan="2">
                <input
                  type="checkbox"
                  className="align-middle"
                  id="flexCheckChecked"
                  checked={selectAll}
                  onChange={(event)=>{handleSelectAll(event.target.checked)}}
                />
              </th>
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
                <CartItem
                  updateCart={updateCart}
                  item={item}
                  key={index}
                  handleChooseItem={handleChooseItem}
                />
              );
            })}
          </tbody>
        </table>

        <h3 className="cart-total-title">THÔNG TIN THANH TOÁN</h3>
        <div className="cart-total-block">
          <div className="cart-total-wrapper">
            <div className="cart-total-text">Tổng cộng</div>
            <div className="cart-total-content">{subToTal} VND</div>
          </div>
          <div className="btn-order-content">
            <button
              className={`${
                subToTal === 0
                  ? "btn btn-dark btn-m btn-block disabled"
                  : "btn btn-dark btn-m btn-block inverted-8"
              }`}
              onClick={handleCheckBeforeClick}
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
