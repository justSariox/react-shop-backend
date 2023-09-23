import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    productImg: String,
    category: String,

}, {timestamps: true})

export default mongoose.model('Products', ProductsSchema)