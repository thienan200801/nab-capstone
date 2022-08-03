import "./style-list-cart-items.css";
import imgsample from "../imgsrc/1.jpg";
import { useState } from "react";

export default function CartItem({ item, updateCart, handleChooseItem }) {
  if (item.quantity === 0) return null;
  console.log("cArtItem,item",item);
  return (
    <tr>
      <th scope="row" className="form-check">
        <input
          type="checkbox"
          className="align-middle"
          id="flexCheckChecked"
          checked={item.checked}
          onChange={() => {
            handleChooseItem(item);
          }}
        />
      </th>
      <th scope="row">
        <img src={imgsample} alt="" className="img-thumbnail cart-item-img" />
      </th>
      <th scope="row">{item.name}</th>
      <th scope="row">{item.categories || "Undefined"}</th>
      <th scope="row">{item.price}</th>
      <th scope="row">
        <button
          className="item-quantity-edit"
          onClick={() => {
            updateCart(item.id, item.quantity - 1);
          }}
        >
          -
        </button>

        <input
          type="text"
          value={item.quantity}
          className="item-quantity-content"
          disabled
        />

        <button
          disabled={item.max_number === item.quantity}
          className="item-quantity-edit"
          onClick={() => {
            updateCart(item.id, item.quantity + 1);
          }}
        >
          +
        </button>
      </th>
      <th scope="row">{item.price * item.quantity} VND</th>
    </tr>
  );
}
