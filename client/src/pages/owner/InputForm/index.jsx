import React from "react";
import '../../../App.css'
import './inputForm.css'
import { Form, Formik, useField, useFormik } from 'formik'
import * as Yup from 'yup'


export const ProductInputForm = (props) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            stock: '',
            colorName: '',
            colorHex: '',
            description: '',
            categories: '',
            pictureUrl: '',
            sizes: ''
        }, validationSchema: Yup.object({
            name: Yup.string().required("You must enter product name").max(144, "Maximun 144 characters"),
            price: Yup.number().typeError("You must enter a number").positive("Must be a positive number").required("You must enter product price"),
            stock: Yup.number().typeError("You must enter a number").positive("Must be a positive number").required("You must enter product stock"),
            colorName: Yup.string().required("You must enter color name"),
            colorHex: Yup.string().required("You must enter color hex").matches(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,"Must be hex code format"),
            description: Yup.string().max(1000, "Maximun 1000 characters"),
            sizes: Yup.string()
        })
    })

    return <section>

        <form className="inputForm" onSubmit={formik.handleSubmit}>
            <h2>Add product</h2>

            {/* Product name */}
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Enter product name" className={formik.touched.name &&formik.errors.name?'errMsg':null} />
            {formik.touched.name && formik.errors.name && (
                <p className="errMsg">{formik.errors.name}</p>
            )}

            {/* Product price */}
            <label htmlFor="price">Price</label>
            <input type="text" id="price" name="price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product price" className={formik.touched.price && formik.errors.price?'errMsg':null}/>
            {formik.touched.price &&formik.errors.price && (
                <p className="errMsg">{formik.errors.price}</p>
            )}

            {/* Product stock */}
            <label htmlFor="stock">Stock</label>
            <input type="text" id="stock" name="stock" value={formik.values.stock} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product stock"  className={formik.touched.stock &&formik.errors.stock?'errMsg':null}/>
            {formik.touched.stock &&formik.errors.stock && (
                <p className="errMsg">{formik.errors.stock}</p>
            )}

            {/* Product color */}
            <label htmlFor="colorName">Product Color</label>
            <input type="text" id="colorName" name="colorName" value={formik.values.colorName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter color name" style={{marginRight: '10px'}} className={formik.touched.colorName &&formik.errors.colorName?'errMsg shortInput':'shortInput'}/>
            <input type="text" id="colorHex" name="colorHex" value={formik.values.colorHex} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter color hex" className={formik.touched.colorHex &&formik.errors.colorHex?'errMsg shortInput':'shortInput'}/>
            {formik.touched.colorHex &&formik.errors.colorHex && (
                <p className="errMsg">{formik.errors.colorHex}</p>
            )}
            {formik.touched.colorName &&formik.errors.colorName && (
                <p className="errMsg">{formik.errors.colorName}</p>
            )}

            
            {/* Product description */}
            <label htmlFor="description">Description</label>
            <textarea rows={5} id="description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product description" className={formik.touched.description && formik.errors.description?'errMsg':null}/>
            {formik.touched.description &&formik.errors.description && (
                <p className="errMsg">{formik.errors.description}</p>
            )}

            {/* Product categories */}
            <label htmlFor="categories">Categories</label>
            <input type="text" id="categories" name="categories" value={formik.values.categories} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product categories" className={formik.touched.categories &&formik.errors.categories?'errMsg':null}/>
            {formik.touched.categories &&formik.errors.categories && (
                <p className="errMsg">{formik.errors.categories}</p>
            )}

            {/* Product url */}
            <label htmlFor="pictureUrl">Picture url</label>
            <input type="text" id="pictureUrl" name="pictureUrl" value={formik.values.pictureUrl} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter picture url" className={formik.touched.pictureUrl &&formik.errors.pictureUrl?'errMsg':null}/>
            {formik.touched.pictureUrl &&formik.errors.pictureUrl && (
                <p className="errMsg">{formik.errors.pictureUrl}</p>
            )}

            {/* Product sizes */}
            <label htmlFor="sizes">Sizes</label>
            <input type="text" id="sizes" name="sizes" value={formik.values.sizes} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter product sizes" className={formik.touched.sizes &&formik.errors.sizes?'errMsg':null}/>
            {formik.touched.sizes &&formik.errors.sizes && (
                <p className="errMsg">{formik.errors.sizes}</p>
            )}
            <div className="footer">
                <button className="btn" type="submit">Add</button>
                <button className="btn cancel" type="reset">Cancel</button>
            </div>
        </form>
    </section>
}