import { client, ListCartItems } from "./list-cart-items";
import { ApolloProvider } from "@apollo/client";
import CustomerInforForm from "./customer-infor-form";
import GetFee from "./fee";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SuccessMessage from "./success-page";
import { useState } from "react";

function CheckOutUI() {
  const [productsToCheckout, setProductsToCheckout] = useState([]);

  return (
    <div>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ListCartItems setProductsToCheckout={setProductsToCheckout} />
              }
            />
            <Route
              path="/thanhtoan"
              element={<CustomerInforForm checkoutItems={productsToCheckout} />}
            />
            <Route path="/thanhcong" element={<SuccessMessage />}></Route>
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </div>
  );
}

export default CheckOutUI;
