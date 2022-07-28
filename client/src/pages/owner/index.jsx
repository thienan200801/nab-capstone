import React, { useEffect } from "react";
import { useState } from "react";
import '../../App.css';
import { useMutationAddProduct } from "../../data/mutations/add-product";
import { useQueryGetProducts } from '../../data/queries/get-products';
import { ProductInputForm } from "./InputForm";

const defaultData = [
    {
        "name": "Nike React Infinity Run Flyknit 3",
        "price": 4409000,
        "stock": 100,
        "categories": [
            "running",
            "women"
        ],
        "pictures": [
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/03bb7279-a9df-4f6c-a2c1-8cfa2290c501/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png",
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/83f84f6a-a25b-4c40-b6e8-e1fd5700b5eb/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png"
        ],
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
        "sizes": [
            "35",
            "36",
            "37",
            "38"
        ]
    }, {
        "name": "Nike React Infinity Run Flyknit 3",
        "price": 4409000,
        "stock": 100,
        "categories": [
            "running",
            "women"
        ],
        "pictures": [
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/03bb7279-a9df-4f6c-a2c1-8cfa2290c501/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png",
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/83f84f6a-a25b-4c40-b6e8-e1fd5700b5eb/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png"
        ],
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
        "sizes": [
            "35",
            "36",
            "37",
            "38"
        ]
    }, {
        "name": "Nike React Infinity Run Flyknit 3",
        "price": 4409000,
        "stock": 100,
        "categories": [
            "running",
            "women"
        ],
        "pictures": [
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/03bb7279-a9df-4f6c-a2c1-8cfa2290c501/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png",
            "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/83f84f6a-a25b-4c40-b6e8-e1fd5700b5eb/react-infinity-run-flyknit-3-road-running-shoes-WnVRk9.png"
        ],
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
        "sizes": [
            "35",
            "36",
            "37",
            "38"
        ]
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
        editInfo: {dataEdit, setDataEdit},
    }
    const [addProductMutation, { dataMutation, loadingMutation, errorMutation }] = useMutationAddProduct();
    const { loading, error, data } = useQueryGetProducts()

    const openEdit = (item) => {
        setDataEdit({...item});
        setIsShow(!isShow);
        setIsEdit(!isEdit)
        // console.log(dataEdit);
    }
    // useEffect(()=>{
    //     console.log(dataEdit)
    // },[dataEdit])

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
                            "sizes": [...value.sizes]
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
                <button className="btn" onClick={() => setIsShow(!isShow)}>Add product</button>
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
                        <div className="item-edit" onClick={()=> openEdit(value)}>
                            <div className="bi bi-pencil"></div>
                        </div>
                        <div className="item-delete">
                            <div className="bi bi-trash"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}
