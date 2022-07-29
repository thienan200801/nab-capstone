import React, { useCallback, useContext, useEffect, useState } from "react";
import '../../../App.css'
import './inputForm.css'
import { Form, Formik, useField, useFormik, withFormik } from 'formik'
import * as Yup from 'yup'
import { StoreContext } from "..";
import { useMutationAddProduct } from "../../../data/mutations/add-product";
import { useQueryGetProducts } from "../../../data/queries/get-products";

export const ProductInputForm = (props) => {
    const { loading, error, data, refetch } = useQueryGetProducts()
    const [addProductMutation, { dataMutation, loadingMutation, errorMutation }] = useMutationAddProduct();
    const store = useContext(StoreContext);
    const [colorValues, setColorValues] = useState([{ name: '', hexValue: '' }]);
    const { errors } = props;

    useEffect(() => {
        if (store.edit.isEdit === true && store.editInfo.dataEdit !== null) {
            const fields = ['name', 'price', 'stock', 'colors', 'description', 'categories', 'pictures', 'sizes']
            fields.forEach((field) => {
                if (field === 'colors' && store.editInfo.dataEdit[field][0]) {
                    const name1 = store.editInfo.dataEdit[field][0].name;
                    const hex1 = store.editInfo.dataEdit[field][0].hexValue;
                    formik.setFieldValue('colorName', name1)
                    formik.setFieldValue('colorHex', hex1)
                }
                if (field === 'pictures' && store.editInfo.dataEdit[field]) {
                    const pic1 = store.editInfo.dataEdit[field].join('  ,  ');
                    formik.setFieldValue('pictureUrl', pic1)
                }
                if (field === 'sizes' && store.editInfo.dataEdit[field]) {
                    const size = store.editInfo.dataEdit[field].join(', ');
                    formik.setFieldValue('sizes', size)
                }
                else
                    return store.editInfo.dataEdit[field] !== null ? formik.setFieldValue(field, store.editInfo.dataEdit[field]) : null
            })
        }
    }, [store.editInfo.dataEdit])
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            price: '',
            stock: '',
            colors: colorValues,
            description: '',
            categories: '',
            pictureUrl: '',
            sizes: '',
            featuringFrom: '',
            featuringTo: '',
        },
        // validationSchema: Yup.object({
        //     name: Yup.string().required("You must enter product name").max(144, "Maximun 144 characters"),
        //     price: Yup.number().typeError("You must enter a number").positive("Must be a positive number").required("You must enter product price"),
        //     stock: Yup.number().typeError("You must enter a number").positive("Must be a positive number").required("You must enter product stock"),
        //     colors: Yup.array().of(Yup.object().shape({
        //         colorName: Yup.string().required("You must enter color name"),
        //         colorHex: Yup.string().required("You must enter color hex").matches(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, "Must be hex code format")
        //     })),
        //     description: Yup.string().max(1000, "Maximun 1000 characters"),
        //     sizes: Yup.string(),
        //     featuringFrom: Yup.string().matches(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/, "Must enter 'Featured from' with dd/mm/yyyy format"),
        //     featuringTo: Yup.string().matches(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/, "Must enter 'Featured to' with dd/mm/yyyy format")
        // }),
        validate: values => {
            let errors = {};

            //Validate product name
            if (!values.name || values.name.trim() === '') {
                errors.name = 'You must enter product name';
            }
            if (values.name && values.name.trim() !== '' && values.name.length > 144) {
                errors.name = 'Maximun 144 characters';
            }

            //validate product price
            if (!values.price || values.price.trim() === '') {
                errors.price = 'You must enter one price';
            }
            if (values.price && values.price.trim() !== '' && ((!isNaN(values.price) && parseInt(formik.values.price) < 0) || isNaN(values.price))) {
                errors.price = 'Must be a positive number'
            }

            //validate product stock
            if (!values.stock || values.stock.trim() === '') {
                errors.stock = 'You must enter one stock';
            }
            if (values.stock && values.stock.trim() !== '' && ((!isNaN(values.stock) && parseInt(formik.values.stock) < 0) || isNaN(values.stock))) {
                errors.stock = 'Must be a positive number'
            }

            //validate product colors
            if (values.colors) {
                errors.colorsIndex = new Array();
                let checkName = false;
                let checkHex = false;
                let checkHexRegex = false;
                const hexRegex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
                values.colors.forEach((v, i) => {
                    if (v.name.trim() === '' && v.hexValue.trim() !== '') {
                        errors.colorsIndex.push(i);
                        checkName = true;
                    }
                    if (v.hexValue.trim() !== '') {
                        if (!hexRegex.test(v.hexValue)) {
                            if (!errors.colorsIndex.includes[i]) {
                                errors.colorsIndex.push(i);
                                checkHexRegex = true;
                            }
                        }
                    }
                    if (v.hexValue.trim() === '' && v.name.trim() !== '') {
                        errors.colorsIndex.push(i);
                        checkHex = true;
                    }
                    if (v.name.trim() === '' && v.hexValue.trim() === '') {
                        errors.colorsIndex.push(i);
                        checkName = true;
                        checkHex = true;
                    }

                })
                if (checkName === true) {
                    errors.colorsName = "You must enter color name";
                }
                if (checkHex === true) {
                    errors.colorsHexValue = "You must enter color hex";
                }
                if (checkHexRegex === true) {
                    errors.colorsHexValueRegex = "Must be hex code format"
                }
            }

            //validate description
            if (values.description && values.description.length > 1000) {
                errors.description = 'Maximun 1000 characters';
            }
            return errors;
        },
        onSubmit: (values) => {
            console.log(values);
            addProductMutation({
                variables: {
                    "item": {
                        "name": values.name,
                        "price": parseInt(values.price),
                        "stock": parseInt(values.stock),
                        "categories": [...values.categories.split(',')],
                        "pictures": [...values.categories.split(',')],
                        "colors": [{ name: values.colorName, hexValue: values.colorHex }],
                        "sizes": [values.sizes],
                        "description": values.description,
                    }
                }
            })
            refetch();
        }
    })
    const addColor = () => {
        if ((formik.touched.colors && !formik.errors.colorsHexValue && !formik.errors.colorsName && !formik.errors.colorsHexValueRegex)) {
            setColorValues([...colorValues, { name: '', hexValue: '' }])
        }
        else if(colorValues.length > 0 && colorValues[0].hexValue.trim() !== '' && colorValues[0].name.trim() !== ''){
            setColorValues([...colorValues, { name: '', hexValue: '' }])
        }
    }
    const removeColor = (index)=>{
        if(colorValues.length>1){
            setColorValues(()=>{colorValues.splice(index,1); return [...colorValues]} )
        }
    }

    const changeColor = (value, index, name, hexValue) => {
        let colorsTemp = [...colorValues];
        if (hexValue === true) {
            colorsTemp[index].hexValue = value;
        }
        if (name === true) {
            colorsTemp[index].name = value;
        }
        setColorValues(colorsTemp);
        formik.setFieldValue('colors',colorValues);
    }
    useEffect(() => {
        console.log(formik.errors)
        //test code
    }, [formik.values, colorValues, formik.errors])

    return store.show.isShow ? <section>
        <form className="inputForm" onSubmit={formik.handleSubmit}>
            <h2>Add product</h2>

            {/* Product name */}
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Enter product name" className={formik.touched.name && formik.errors.name ? 'errMsg' : null} />
            {formik.touched.name && formik.errors.name && (
                <p className="errMsg">{formik.errors.name}</p>
            )}

            {/* Product price */}
            <label htmlFor="price">Price</label>
            <input type="text" id="price" name="price" value={formik.values.price} onChange={formik.handleChange}  onBlur={formik.handleBlur} placeholder="Enter product price" className={formik.touched.price && formik.errors.price ? 'errMsg' : null} />
            {formik.touched.price && formik.errors.price && (
                <p className="errMsg">{formik.errors.price}</p>
            )}

            {/* Product stock */}
            <label htmlFor="stock">Stock</label>
            <input type="text" id="stock" name="stock" value={formik.values.stock} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product stock" className={formik.touched.stock && formik.errors.stock ? 'errMsg' : null} />
            {formik.touched.stock && formik.errors.stock && (
                <p className="errMsg">{formik.errors.stock}</p>
            )}

            {/* Product color */}
            <label htmlFor="colorName">Product Color <span className="bi bi-plus" onClick={() => addColor()}></span></label>
            {colorValues.map((value, index) => {
                return (<div className="colorInput" key={index}>
                    <input type="text" id="colors" name="colors" value={colorValues[index].name} onChange={(e) => {changeColor(e.target.value, index, true, false)}} onBlur={formik.handleBlur} placeholder="Enter color name" style={{ marginRight: '10px' }} className={formik.touched.colors && formik.errors.colorsIndex?.includes(index) && formik.errors.colorsName ? 'errMsg shortInput' : 'shortInput'} />
                    <input type="text" name="colors" value={colorValues[index].hexValue} onChange={(e) => changeColor(e.target.value, index, false, true)} onBlur={formik.handleBlur} placeholder="Enter color hex" className={formik.touched.colors && formik.errors.colorsIndex?.includes(index) && (formik.errors.colorsHexValue || formik.errors.colorsHexValueRegex) ? 'errMsg shortInput' : 'shortInput'} />
                    <span className="shortInput bi bi-dash-circle" style={{ marginLeft: '10px' }} onClick={()=>removeColor(index)}></span>
                    {formik.touched.colors && formik.errors.colorsIndex?.includes(index) && formik.errors.colorsName && (
                        <p className="errMsg">{formik.errors.colorsName}</p>
                    )}
                    {formik.touched.colors && formik.errors.colorsIndex?.includes(index) && formik.errors.colorsHexValue && (
                        <p className="errMsg">{formik.errors.colorsHexValue}</p>
                    )}
                    {formik.touched.colors && formik.errors.colorsIndex?.includes(index) && formik.errors.colorsHexValueRegex && (
                        <p className="errMsg">{formik.errors.colorsHexValueRegex}</p>
                    )}
                </div>)
            })}

            {/* Product description */}
            <label htmlFor="description">Description</label>
            <textarea rows={5} id="description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product description" className={formik.touched.description && formik.errors.description ? 'errMsg' : null} />
            {formik.touched.description && formik.errors.description && (
                <p className="errMsg">{formik.errors.description}</p>
            )}

            {/* Product categories */}
            <label htmlFor="categories">Categories</label>
            <input type="text" id="categories" name="categories" value={formik.values.categories} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product categories" className={formik.touched.categories && formik.errors.categories ? 'errMsg' : null} />
            {formik.touched.categories && formik.errors.categories && (
                <p className="errMsg">{formik.errors.categories}</p>
            )}

            {/* Product url */}
            <label htmlFor="pictureUrl">Picture url</label>
            <input type="text" id="pictureUrl" name="pictureUrl" value={formik.values.pictureUrl} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter picture url" className={formik.touched.pictureUrl && formik.errors.pictureUrl ? 'errMsg' : null} />
            {formik.touched.pictureUrl && formik.errors.pictureUrl && (
                <p className="errMsg">{formik.errors.pictureUrl}</p>
            )}

            {/* Product sizes */}
            <label htmlFor="sizes">Sizes</label>
            <input type="text" id="sizes" name="sizes" value={formik.values.sizes} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product sizes" className={formik.touched.sizes && formik.errors.sizes ? 'errMsg' : null} />
            {formik.touched.sizes && formik.errors.sizes && (
                <p className="errMsg">{formik.errors.sizes}</p>
            )}

            {/* Featured */}
            <div style={{ display: 'flex', marginTop: '10px', marginBottom: '5px' }}>
                <label htmlFor="featuringFrom" className="shortLabel">Featured from</label>
                <label htmlFor="featuringTo" className="shortLabel">Featured to</label>
            </div>
            <input type="text" id="featuringFrom" name="featuringFrom" value={formik.values.featuringFrom} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="dd/mm/yyyy" style={{ marginRight: '10px' }} className={formik.touched.featuringFrom && formik.errors.featuringFrom ? 'errMsg shortInput' : 'shortInput'} />
            <input type="text" id="featuringTo" name="featuringTo" value={formik.values.featuringTo} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="dd/mm/yyyy" className={formik.touched.featuringTo && formik.errors.featuringTo ? 'errMsg shortInput' : 'shortInput'} />
            {formik.touched.featuringFrom && formik.errors.featuringFrom && (
                <p className="errMsg">{formik.errors.featuringFrom}</p>
            )}
            {formik.touched.featuringTo && formik.errors.featuringTo && (
                <p className="errMsg">{formik.errors.featuringTo}</p>
            )}

            <div className="footer">
                <button className="btn" type="submit" disabled={!formik.isValid}>Add</button>
                <button className="btn cancel" type="reset" onClick={() => { store.show.setIsShow(!store.show.isShow); store.edit.setIsEdit(false); formik.resetForm(); setColorValues([{name: '', hexValue: ''}]) }}
                >Cancel</button>
            </div>
        </form>
    </section> : null
}
