import React, { useEffect } from "react";
import { useState } from "react";
import '../../App.css';
import { useMutationAddProduct } from "../../data/mutations/add-product";
import { useMutationRemoveProduct } from "../../data/mutations/remove-product";
import { useQueryGetProducts } from '../../data/queries/get-products';
import { InputCustomerID } from "../main-page/inputCustomerID/inputCustomerID";
import { ProductInputForm } from "./InputForm";

const defaultData = [
    {
        "id": "0c01eac9-51e6-4be3-8cbd-36854f066cf8",
        "name": "Nike React Infinity Run Flyknit 1234",
        "price": 102,
        "stock": 1004,
        "colors": [
            {
                "name": "xanh dương",
                "hexValue": "#803362"
            },
            {
                "name": "tím",
                "hexValue": "#cbd3d5"
            }
        ],
        "description": "",
        "categories": [
            "running",
            "women"
        ],
        "pictures": [
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/03bb7279-a9df-4f6c-a2c1-8cfa2290c501/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png",
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/83f84f6a-a25b-4c40-b6e8-e1fd5700b5eb/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png"
        ],
        "sizes": [
            "3",
            "36",
            "37",
            "38"
        ],
        "featuringFrom": "11/11/2022",
        "featuringTo": "12/12/2022"
    },
    {
        "id": "0186ddc8-3c22-4c72-9237-3ef4a58e29a4",
        "name": "Nike React Infinity Run Flyknit 3",
        "price": 4409000,
        "stock": 100,
        "colors": [
            {
                "name": "Pink Prime",
                "hexValue": "#803362"
            },
            {
                "name": "Pure Platinum",
                "hexValue": "#cbd3d5"
            }
        ],
        "description": null,
        "categories": [
            "running",
            "women"
        ],
        "pictures": [
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/03bb7279-a9df-4f6c-a2c1-8cfa2290c501/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png",
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/83f84f6a-a25b-4c40-b6e8-e1fd5700b5eb/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png"
        ],
        "sizes": [
            "35",
            "36",
            "37",
            "38"
        ],
        "featuringFrom": null,
        "featuringTo": null
    },
    {
        "id": "73636179-bf80-48d2-90c0-ad554f764394",
        "name": "Nước rửa khóe mắt chó mèo Precaten",
        "price": 12222,
        "stock": 123,
        "colors": [
            {
                "name": "green",
                "hexValue": "#112"
            },
            {
                "name": "red",
                "hexValue": "#123"
            },
            {
                "name": "blue",
                "hexValue": "#125"
            }
        ],
        "description": "test2",
        "categories": [
            "cate1",
            " cate2",
            " cate3"
        ],
        "pictures": [
            "http",
            "httpsc"
        ],
        "sizes": [
            "23",
            "24"
        ],
        "featuringFrom": "01/01/2001",
        "featuringTo": "02/02/2002"
    }
]

export const StoreContext = React.createContext(null);

export const Owner = (props) => {
    const [isShow, setIsShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const store = {
        show: { isShow, setIsShow },
        edit: { isEdit, setIsEdit },
        editInfo: { dataEdit, setDataEdit },
    }
    const [addProductMutation, { dataMutation, loadingMutation, errorMutation }] = useMutationAddProduct();
    const [removeProductMutation, resultRemove] = useMutationRemoveProduct();

    const { loading, error, data, refetch } = useQueryGetProducts();

    const openEdit = (item) => {
        setDataEdit({ ...item });
        setIsShow(true);
        setIsEdit(true);
    }

    const removeProduct = (id) => {
        removeProductMutation({
            variables: {
                "removeProductId": id
            }
        })
        refetch();
    }

    useEffect(() => {
        if (data && data.products.length === 0) {
            console.log(data.products.length)
            defaultData.forEach((value) => {
                addProductMutation({
                    variables: {
                        "item": {
                            "name": value.name,
                            "price": value.price,
                            "stock": value.stock,
                            "categories": [...value.categories],
                            "pictures": [...value.pictures],
                            "colors": [...value.colors],
                            "sizes": [...value.sizes],
                            "featuringFrom": value.featuringFrom,
                            "featuringTo": value.featuringTo
                        }
                    }
                })
            })
        }
    }, [data])
    return <div style={{ width: '100vw', position: 'relative' }}>
        <StoreContext.Provider value={store}>
            <ProductInputForm className="owner-input-form" isShow={isShow}></ProductInputForm>
        </StoreContext.Provider>
        <div className="owner-container">
            <div className="header">
                <div className="table-name">PRODUCT LIST</div>
                <button className="btn" onClick={() => {setIsShow(true)}}>Add product</button>
            </div>
            <div className="main">
                <div className="owner-title">
                    <div className="title-name">Name</div>
                    <div className="title-price">Price</div>
                    <div className="title-color">Color</div>
                    <div className="title-size">Size</div>
                    <div className="title-edit">Edit</div>
                    <div className="title-delete">Delete</div>
                </div>
                {data?.products.map((value) => (
                    <div className="owner-item" key={value.id}>
                        <div className="item-name">{value.name}</div>
                        <div className="item-price">{value.price}</div>
                        <div className="item-color">{
                            value.colors.map((value2, index) => {
                                if (index !== value.colors.length - 1) {
                                    return value2.name + ', '
                                }
                                else
                                    return value2.name
                            })
                        }</div>
                        <div className="item-size">{value.sizes.map((value2, index) => {
                            if (index !== value.sizes.length - 1) {
                                return value2 + ', '
                            }
                            else
                                return value2
                        })}</div>
                        <div className="item-edit" onClick={() => openEdit(value)}>
                            <div className="bi bi-pencil"></div>
                        </div>
                        <div className="item-delete">
                            <div className="bi bi-trash" onClick={() => removeProduct(value.id)}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}
