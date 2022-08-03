import { Formik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import nikeLogo from "../imgsrc/nike-logo.png";
import GetFee from "./fee";
import "./style-customer-info.css";
import TableProductInCart from "./table_products_in_cart";
import { gql, useMutation } from "@apollo/client";


const GET_PRODUCT_INFOR = gql`
  mutation Mutation($customerId: ID!) {
    emptyCart(customerId: $customerId) {
      id
    }
  }
`;

export default function CheckoutInfoForm({
  customerInfo,
  handleGetLocation,
  checkoutItems,
  subTotal,
  getLocation,
  updateInfo,
}) {
  console.log("customerInfo", customerInfo);
  const [emptyCart, emptyCartResult] = useMutation(GET_PRODUCT_INFOR);

  const navigate = useNavigate();

  const handleCheckout = () => {
    emptyCart({
      variables: {
        customerId: "nvp",
      },
    }).then(() => {
      navigate("../thanhcong");
    });
  };

  const { name } = customerInfo || {};

  if (!customerInfo.id ) return null;


  return (
    <div>
      <div>
        <Formik
          initialValues={{ name: name, email: "novapo@gmail.com" }}
          validate={(values) => {
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
          }}
          onSubmit={(values, { setSubmitting }) => {
            updateInfo(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>

              <div className="header-wrapper">
                <img src={nikeLogo} alt="Nike Logo" className="nike-logo" />
                <h2 className="customer-infor-header">THANH TOÁN</h2>
              </div>
              <label htmlFor="name">Họ tên</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                value={values.name}
                className="form-control"
              />
              {errors.name ? <div className="error">{errors.name}</div> : null}
              <br />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={values.email}
                className="form-control"
              />
              <br />
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                name="phone"
                type="text"
                onChange={handleChange}
                value={values.phone}
                className="form-control"
              />
              <br />

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="province">Tỉnh/Thành phố</label>
                  <input
                    id="province"
                    name="province"
                    type="text"
                    onChange={(e) => {
                      handleChange(e);
                      handleGetLocation(e);
                    }}
                    value={values.province}
                    className="form-control"
                  />
                  {errors.province ? (
                    <div className="error">{errors.province}</div>
                  ) : null}
                  <br />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="district">Quận/ Huyện</label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    onChange={handleChange}
                    value={values.district}
                    className="form-control"
                  />
                  {errors.district ? (
                    <div className="error">{errors.district}</div>
                  ) : null}
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="address">Số nhà</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  onChange={handleChange}
                  value={values.address}
                  className="form-control"
                />
                {errors.address ? (
                  <div className="error">{errors.address}</div>
                ) : null}
              </div>

              <TableProductInCart productsInCart={checkoutItems} />
              <GetFee location={getLocation} subTotal={subTotal} />

              <div to="/thanhcong" className="btn-order-content">
                <div className="button-order">
                  <button
                    onClick={handleCheckout}
                    class="btn btn-dark btn-lg d-1"
                    type="submit"
                  >
                    ĐẶT HÀNG
                  </button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
