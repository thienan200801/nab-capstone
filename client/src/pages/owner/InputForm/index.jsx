import React, { useCallback, useContext, useEffect, useState } from "react";
import '../../../App.css'
import './inputForm.css'
import { Form, Formik, useField, useFormik, withFormik } from 'formik'
import * as Yup from 'yup'
import { StoreContext } from "..";
import { useMutationAddProduct } from "../../../data/mutations/add-product";
import { useQueryGetProducts } from "../../../data/queries/get-products";
import { useMutationUpdateProduct } from "../../../data/mutations/update-product";

export const ProductInputForm = (props) => {
    const { loading, error, data, refetch } = useQueryGetProducts()
    const [addProductMutation, { dataMutation, loadingMutation, errorMutation }] = useMutationAddProduct();
    const [updateProductMutation, resultUpdate] = useMutationUpdateProduct();

    const store = useContext(StoreContext);
    const [colorValues, setColorValues] = useState([{ name: '', hexValue: '' }]);
    const [urlPictures, setUrlPictures] = useState(['']);
    const [sizes, setSizes] = useState([''])
    const { errors } = props;

    //When staying in showMode, data of edited item will be loaded into form
    useEffect(() => {
        if (store.edit.isEdit === true && store.editInfo.dataEdit !== null) {
            const fields = ['name', 'price', 'stock', 'colors', 'description', 'categories', 'pictures', 'sizes', 'featuringFrom', 'featuringTo']
            fields.forEach((field) => {
                if (field === 'colors') {
                    setColorValues([...store.editInfo.dataEdit.colors])
                }
                if (field === 'pictures') {
                    setUrlPictures([...store.editInfo.dataEdit.pictures])
                }
                if (field === 'sizes') {
                    setSizes([...store.editInfo.dataEdit.sizes])
                }
                if (field === 'price') {
                    formik.setFieldValue('price', store.editInfo.dataEdit.price)
                }
                if (field === 'stock') {
                    formik.setFieldValue('stock', store.editInfo.dataEdit.stock)
                }
                else
                    return store.editInfo.dataEdit[field] !== null ? formik.setFieldValue(field, store.editInfo.dataEdit[field]) : null
            })
        }
    }, [store.editInfo.dataEdit])

    //Create formik
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            price: '',
            stock: '',
            colors: [{ name: '', hexValue: '' }],
            description: '',
            categories: '',
            pictureUrl: [''],
            sizes: [''],
            featuringFrom: '',
            featuringTo: '',
        },
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
            if (!values.price || values.price.toString().trim() === '') {
                errors.price = 'You must enter one price';
            }
            if (values.price && values.price.toString().trim() !== '' && ((!isNaN(values.price) && parseInt(formik.values.price) < 0) || isNaN(values.price))) {
                errors.price = 'Must be a positive number'
            }

            //validate product stock
            if (!values.stock || values.stock.toString().trim() === '') {
                errors.stock = 'You must enter one stock';
            }
            if (values.stock && values.stock.toString().trim() !== '' && ((!isNaN(values.stock) && parseInt(formik.values.stock) < 0) || isNaN(values.stock))) {
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

            //validate categories
            if (!values.categories || values.categories.trim === '') {
                errors.categories = 'Must enter a least one category';
            }

            //validate urlPictures
            if (values.pictureUrl) {
                errors.urlPicturesIndex = new Array();
                let checkUrlPictures = false;
                values.pictureUrl.forEach((v, i) => {
                    if (v.trim() === '') {
                        errors.urlPicturesIndex.push(i);
                        checkUrlPictures = true;
                    }
                })
                if (checkUrlPictures === true) {
                    errors.urlPictures = 'Must enter url picture'
                }
            }

            //validate size
            if (values.sizes) {
                errors.sizeIndex = new Array();
                let checkSize = false;
                values.sizes.forEach((v, i) => {
                    if (v.trim() === '') {
                        errors.sizeIndex.push(i);
                        checkSize = true;
                    }
                })
                if (checkSize === true) {
                    errors.sizes = "Must enter size"
                }
            }

            //validate fetured from
            const checkFeaturedRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
            if (values.featuringFrom) {
                if (!checkFeaturedRegex.test(values.featuringFrom)) {
                    errors.featuringFrom = 'Featuring From must be in dd/mm/yyyy format';
                }
                else {
                    let today = new Date();
                    let dd = today.getDate();
                    let mm = today.getMonth() + 1;
                    let yyyy = today.getFullYear();
                    let inputDayFrom = values.featuringFrom.substring(0, 2);
                    let inputMonthFrom = values.featuringFrom.substring(3, 5);
                    let inputYearFrom = values.featuringFrom.substring(6, 11);
                    if (parseInt(inputYearFrom) < parseInt(yyyy)) {
                        errors.featuringFrom = 'Featuring From must be greater than or equal today'
                    }
                    else if (parseInt(inputYearFrom) === parseInt(yyyy) && parseInt(inputMonthFrom) < parseInt(mm)) {
                        errors.featuringFrom = 'Featuring From must be greater than or equal today'
                    }
                    else if (parseInt(inputYearFrom) === parseInt(yyyy) && parseInt(inputMonthFrom) === parseInt(mm) && parseInt(inputDayFrom) < parseInt(dd)) {
                        errors.featuringFrom = 'Featuring From must be greater than or equal today'
                    }
                }
            }
            //validate featured to
            if (values.featuringTo) {
                if (!checkFeaturedRegex.test(values.featuringTo)) {
                    errors.featuringTo = 'Featuring To must be in dd/mm/yyyy format';
                }
                else {
                    let inputDayFrom = values.featuringFrom.substring(0, 2);
                    let inputMonthFrom = values.featuringFrom.substring(3, 5);
                    let inputYearFrom = values.featuringFrom.substring(6, 11);

                    let inputDayTo = values.featuringTo.substring(0, 2);
                    let inputMonthTo = values.featuringTo.substring(3, 5);
                    let inputYearTo = values.featuringTo.substring(6, 11);
                    if (parseInt(inputYearTo) < parseInt(inputYearFrom)) {
                        errors.featuringTo = 'Featuring To must be greater than Featuring From'
                    }
                    else if (parseInt(inputYearTo) === parseInt(inputYearFrom) && parseInt(inputMonthTo) < parseInt(inputMonthFrom)) {
                        errors.featuringTo = 'Featuring To must be greater than Featuring From'
                    }
                    else if (parseInt(inputYearTo) === parseInt(inputYearFrom) && parseInt(inputMonthTo) === parseInt(inputMonthFrom) && parseInt(inputDayTo) < parseInt(inputDayFrom)) {
                        errors.featuringTo = 'Featuring To must be greater than Featuring From'
                    }
                }
            }

            return errors;


        }
    })

    //add, remove, change colors
    const addColor = () => {
        if ((formik.touched.colors && !formik.errors.colorsHexValue && !formik.errors.colorsName && !formik.errors.colorsHexValueRegex)) {
            setColorValues([...colorValues, { name: '', hexValue: '' }])
        }
        else if (colorValues.length > 0 && colorValues[0].hexValue.trim() !== '' && colorValues[0].name.trim() !== '') {
            setColorValues([...colorValues, { name: '', hexValue: '' }])
        }
    }
    const removeColor = (index) => {
        // console.log(()=>{colorValues.splice(index,1);return colorValues});
        if (colorValues.length > 1) {
            colorValues.splice(index, 1);
            setColorValues([...colorValues])
        }
    }

    const changeColor = (value, index, name, hexValue) => {
        let colorsTemp = [];
        colorValues.forEach((v, i) => {
            let tempObj = {}
            Object.defineProperties(tempObj, {
                name: {
                    value: v.name,
                    writable: true,
                    enumerable: true
                },
                hexValue: {
                    value: v.hexValue,
                    writable: true,
                    enumerable: true
                }
            })
            colorsTemp.push(tempObj);
        })
        console.log(colorsTemp);
        if (hexValue === true) {
            colorsTemp[index].hexValue = value;
        }
        if (name === true) {
            colorsTemp[index].name = value;

        }
        setColorValues(colorsTemp);
        formik.setFieldValue('colors', colorValues);
    }

    //add, remove, change url picture
    const addUrlPictures = () => {
        if (formik.touched.pictureUrl && !formik.errors.urlPictures) {
            setUrlPictures([...urlPictures, '']);
        }
    }
    const changeUrlPictures = async (value, index) => {
        let urlPicturesTemp = [...urlPictures];
        urlPicturesTemp[index] = value;
        setUrlPictures(urlPicturesTemp);
    }
    const removeUrlPictures = (index) => {
        if (urlPictures.length > 1) {
            urlPictures.splice(index, 1);
            setUrlPictures([...urlPictures]);
        }
    }


    //add, remove, change sizes
    const addSize = () => {
        if (formik.touched.sizes && !formik.errors.sizes) {
            setSizes([...sizes, '']);
        }
    }
    const changeSize = (value, index) => {
        let sizesTemp = [...sizes];
        sizesTemp[index] = value;
        setSizes(sizesTemp);
    }
    const removeSize = (index) => {
        if (sizes.length > 1) {
            sizes.splice(index, 1);
            setSizes([...sizes]);
        }
    }

    //Submit add product
    const addProduct = (values) => {
        if (!store.edit.isEdit) {
            addProductMutation({
                variables: {
                    "item": {
                        "name": values.name,
                        "price": parseInt(values.price),
                        "stock": parseInt(values.stock),
                        "categories": [...values.categories.split(',')],
                        "pictures": [...values.pictureUrl],
                        "colors": [...values.colors],
                        "sizes": [...values.sizes],
                        "description": values.description,
                        "featuringFrom": values.featuringFrom,
                        "featuringTo": values.featuringTo
                    }
                }
            }).then(() => {
                store.show.setIsShow(false);
                refetch();
            })
        }
        else {
            let field = Object.keys(values);
            let product = {}
            field.forEach((value) => {
                if (value !== 'pictureUrl' && value !== 'price' && value !== 'stock' && store.editInfo.dataEdit[value] !== values[value]) {
                    if (Array.isArray(values[value])) {
                        if (!isEqualArray(values[value], store.editInfo.dataEdit[value])) {
                            product[value] = values[value]
                        }
                        // console.log("TH1")
                        // console.log(values[value]);
                        // console.log(store.editInfo.dataEdit[value])
                        // console.log(isEqualArray(values[value], store.editInfo.dataEdit[value]))

                    }
                    if (!Array.isArray(values[value])) {
                        product[value] = values[value]
                        // console.log(store.editInfo.dataEdit[value]);
                        // console.log(values[value]);
                    }
                }
                if (value === 'price' && store.editInfo.dataEdit[value].toString() !== values[value].toString()) {
                    product[value] = values[value];
                }
                if (value === 'stock' && store.editInfo.dataEdit[value].toString() !== values[value].toString()) {
                    product[value] = values[value];
                }
                if (value === 'pictureUrl' && !isEqualArray(values.pictureUrl, store.editInfo.dataEdit.pictures)) {
                    product.pictureUrl = values.pictureUrl
                }
            })


            if (Object.keys(product).length > 0) {
                product.id = store.editInfo.dataEdit.id;
                let product_update = {
                    ...(product.id && { id: product.id }),
                    ...(product.name && { name: product.name }),
                    ...(product.price && { price: parseInt(product.price) }),
                    ...(product.stock && { stock: parseInt(product.stock) }),
                    ...(product.stock && { stock: parseInt(product.stock) }),
                    ...(product.colors && { colors: [...product.colors] }),
                    ...(product.description && { description: product.description }),
                    ...(product.categories && { categories: [...product.categories.split(',')] }),
                    ...(product.sizes && { sizes: [...product.sizes] }),
                    ...(product.pictureUrl && { pictures: [...product.pictureUrl] }),
                    ...(product.featuringFrom && { featuringFrom: product.featuringFrom }),
                    ...(product.featuringTo && { featuringTo: product.featuringTo }),
                }
                updateProductMutation({
                    variables: {
                        product: product_update
                    }
                }).then(() => {
                    store.show.setIsShow(false);
                    refetch();
                }
                )

            }


        }
    }

    //fuction compare two array
    const isEqualArray = (arr1, arr2) => {
        let result = true;
        if (arr1.length >= arr2.length) {
            arr1.forEach((value, index) => {
                if (value !== arr2[index]) {
                    result = false;
                }
            })
        }
        else {
            arr2.forEach((value, index) => {
                if (value !== arr1[index]) {
                    result = false;
                }
            })
        }

        return result;
    }

    //when color state is changed, formik value will be updated in 'colors' fields
    useEffect(() => {
        formik.setFieldValue('colors', colorValues);
    }, [colorValues])

    //when urlPictures state is changed, formik value will be updated in 'pictureUrl' fields
    useEffect(() => {
        formik.setFieldValue('pictureUrl', urlPictures);
        //After calling setFieldValue, the formik.values is updated, but has not yet checked validation of pictureUrl
        //So we need use setFieldTouched to using blur event
        //After blur, the formik.errors is updated validation
        setTimeout(() => formik.setFieldTouched('pictureUrl', true))
    }, [urlPictures])

    //when sizes state is changed, formik value will be updated in 'sizes' fields
    useEffect(() => {
        formik.setFieldValue('sizes', sizes)
    }, [sizes])


    return store.show.isShow ? <section>
        <form
            className="inputForm"
            onSubmit={formik.handleSubmit}>

            <h2>Add product</h2>

            {/* Product name */}
            <label
                htmlFor="name">
                Name
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder="Enter product name"
                className={formik.touched.name && formik.errors.name ? 'errMsg' : null} />
            {formik.touched.name && formik.errors.name && (
                <p className="errMsg">{formik.errors.name}</p>
            )}

            {/* Product price */}
            <label
                htmlFor="price">
                Price
            </label>
            <input
                type="text"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product price"
                className={formik.touched.price && formik.errors.price ? 'errMsg' : null} />
            {formik.touched.price && formik.errors.price && (
                <p className="errMsg">{formik.errors.price}</p>
            )}

            {/* Product stock */}
            <label
                htmlFor="stock">
                Stock
            </label>
            <input
                type="text"
                id="stock"
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product stock"
                className={formik.touched.stock && formik.errors.stock ? 'errMsg' : null} />
            {formik.touched.stock && formik.errors.stock && (
                <p className="errMsg">{formik.errors.stock}</p>
            )}

            {/* Product color */}
            <label
                htmlFor="colorName">
                Product Color
                <span
                    className="bi bi-plus"
                    onClick={() => addColor()}>
                </span>
            </label>
            {colorValues.map((value, index) => {
                return (<div
                    className="colorInput"
                    key={index}>
                    <input
                        type="text"
                        id="colors"
                        name="colors"
                        value={value.name}
                        onChange={(e) => { changeColor(e.target.value, index, true, false) }}
                        onBlur={formik.handleBlur}
                        placeholder="Enter color name"
                        style={{ marginRight: '10px' }}
                        className={formik.touched.colors && formik.errors.colorsIndex?.includes(index) && formik.errors.colorsName ? 'errMsg shortInput' : 'shortInput'} />
                    <input
                        type="text"
                        name="colors"
                        value={value.hexValue}
                        onChange={(e) => changeColor(e.target.value, index, false, true)}
                        onBlur={formik.handleBlur}
                        placeholder="Enter color hex"
                        className={formik.touched.colors && formik.errors.colorsIndex?.includes(index) && (formik.errors.colorsHexValue || formik.errors.colorsHexValueRegex) ? 'errMsg shortInput' : 'shortInput'} />
                    <span
                        className="shortInput bi bi-dash-circle"
                        style={{ marginLeft: '10px' }}
                        onClick={() => removeColor(index)}>

                    </span>
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
            <label
                htmlFor="description">
                Description
            </label>
            <textarea
                rows={5}
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product description"
                className={formik.touched.description && formik.errors.description ? 'errMsg' : null} />
            {formik.touched.description && formik.errors.description && (
                <p className="errMsg">{formik.errors.description}</p>
            )}

            {/* Product categories */}
            <label
                htmlFor="categories">
                Categories
            </label>
            <input
                type="text"
                id="categories"
                name="categories"
                value={formik.values.categories}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product categories"
                className={formik.touched.categories && formik.errors.categories ? 'errMsg' : null} />
            {formik.touched.categories && formik.errors.categories && (
                <p className="errMsg">{formik.errors.categories}</p>
            )}

            {/* Product url */}
            <label
                htmlFor="pictureUrl">
                Picture url
                <span
                    className="bi bi-plus"
                    onClick={() => addUrlPictures()}>
                </span>
            </label>
            {urlPictures.map((value, index) => {
                return (<div key={index}>
                    <div style={{ position: 'relative' }}>
                        <input type="text" style={{ width: '90%' }} id="pictureUrls" name="pictureUrls" value={value} onChange={(e) => changeUrlPictures(e.target.value, index)} onBlur={formik.handleBlur} placeholder="Enter picture url" className={formik.touched.pictureUrls && formik.errors.urlPictures && formik.errors.urlPicturesIndex?.includes(index) ? 'errMsg' : null} />
                        <span className="shortInput bi bi-dash-circle" style={{ marginLeft: '10px', position: 'absolute', top: '15px', right: '0px', textAlign: 'right', padding: '0px', margin: '0px' }} onClick={() => removeUrlPictures(index)}></span>
                    </div>
                    {formik.touched.pictureUrls && formik.errors.urlPictures && formik.errors.urlPicturesIndex?.includes(index) && (
                        <p className="errMsg">{formik.errors.urlPictures}</p>
                    )}
                </div>)
            })}

            {/* Product sizes */}
            <label
                htmlFor="sizes">
                Sizes
                <span
                    className="bi bi-plus"
                    onClick={() => addSize()}>
                </span>
            </label>
            {sizes.map((value, index) => {
                return (<div
                    key={index}>
                    <input
                        type="text"
                        id="sizes"
                        name="sizes"
                        value={value}
                        onChange={(e) => changeSize(e.target.value, index)}
                        onBlur={formik.handleBlur}
                        placeholder="Enter product sizes"
                        className={formik.touched.sizes && formik.errors.sizes && formik.errors.sizeIndex?.includes(index) ? 'errMsg shortInput' : 'shortInput'} />
                    <span
                        className="shortInput bi bi-dash-circle"
                        style={{ marginLeft: '10px' }}
                        onClick={() => removeSize(index)}>
                    </span>
                    {formik.touched.sizes && formik.errors.sizes && formik.errors.sizeIndex?.includes(index) && (
                        <p className="errMsg">{formik.errors.sizes}</p>
                    )}
                </div>)
            })}


            {/* Featured */}
            <div style={{ display: 'flex', marginTop: '10px', marginBottom: '5px' }}>
                <label
                    htmlFor="featuringFrom"
                    className="shortLabel">
                    Featured from
                </label>
                <label
                    htmlFor="featuringTo"
                    className="shortLabel">
                    Featured to
                </label>
            </div>
            <input
                type="text"
                id="featuringFrom"
                name="featuringFrom"
                value={formik.values.featuringFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="dd/mm/yyyy"
                style={{ marginRight: '10px' }}
                className={formik.touched.featuringFrom && formik.errors.featuringFrom ? 'errMsg shortInput' : 'shortInput'} />
            <input
                type="text"
                id="featuringTo"
                name="featuringTo"
                value={formik.values.featuringTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="dd/mm/yyyy"
                className={formik.touched.featuringTo && formik.errors.featuringTo ? 'errMsg shortInput' : 'shortInput'} />
            {formik.touched.featuringFrom && formik.errors.featuringFrom && (
                <p className="errMsg">{formik.errors.featuringFrom}</p>
            )}
            {formik.touched.featuringTo && formik.errors.featuringTo && (
                <p className="errMsg">{formik.errors.featuringTo}</p>
            )}

            <div className="footer">
                <button
                    className="btn"
                    type="submit"
                    disabled={Object.values(formik.errors).flat().length !== 0}
                    onClick={() => addProduct(formik.values)}>
                    {store.edit.isEdit ? 'Change' : 'Add'}
                </button>
                <button
                    className="btn cancel"
                    type="reset"
                    onClick={() => { store.show.setIsShow(!store.show.isShow); store.edit.setIsEdit(false); formik.resetForm(); setColorValues([{ name: '', hexValue: '' }]); setUrlPictures(['']); setSizes(['']) }}
                >Cancel</button>
            </div>
        </form>
    </section> : null
}
