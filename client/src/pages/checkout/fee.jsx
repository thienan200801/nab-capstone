import { gql, useQuery } from '@apollo/client';
import React from 'react';
import './style-customer-info.css';

const GET_FEE = gql`
    query($location: String!) {
        fee(location: $location) {
        shipping
        tax
        }
    }
`
export default function GetFee({location, subTotal}) {
    console.log(subTotal)
    const {loading, error, data} = useQuery(GET_FEE, {
        variables: {
            "location": location
        }
    });
    if (loading) return <p>Loading...</p>;
    if(error) return <p>Tax and Shipping fee are calculating...</p>;

    return (<div className="table total">
        <div className='shipping'>
            <div className='shipping-title'>Tạm tính <sup>đ</sup></div>
            <div className='shipping-content'>{subTotal}</div>
        </div>
        <div className='shipping'>
            <div className='shipping-title'>Phí vận chuyển <sup>đ</sup></div>
            <div className='shipping-content'>{Math. round(data?.fee?.shipping)}</div>
        </div>
        <div className='shipping'>
            <div className='shipping-title'>Thuế <sup>đ</sup></div>
            <div className='shipping-content'>{Math. round(data?.fee?.tax*subTotal)}</div>
        </div>
        <div className='shipping total-price'>
        <div className='shipping-title'>Tổng cộng <sup>đ</sup></div>
            <div className='shipping-content total-price-content'>{Math. round(data?.fee?.tax*subTotal + data?.fee?.shipping + subTotal)}</div>
        </div>
    </div>)
}