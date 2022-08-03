import React from "react";

export default function TableProductInCart({ productsInCart }) {
    console.log("products incarts",productsInCart);
  return (
    <div>
      <h3 className="form-order-title">ĐƠN HÀNG CỦA BẠN</h3>
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
                <th scope="row" className="form-check"></th>
                <th scope="row">
                  <img src="" alt="" className="img-thumbnail cart-item-img" />
                </th>
                <th scope="row">{item.name}</th>
                <th scope="row">{item.categories || "Undefined"}</th>
                <th scope="row">{item.price}</th>
                <th scope="row quantity">{item.quantity}</th>
                <th scope="row">
                  {item.price * item.quantity} <sup>đ</sup>{" "}
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
