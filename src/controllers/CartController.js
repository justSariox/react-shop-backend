import CartModel from '../models/Cart.js'
import ProductsModel from "../models/Products.js";

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.id

        const cart = await CartModel.findById(cartId)
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена!'})
        }

        return res.json(cart)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.id
        const cart = await CartModel.findById(cartId)
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена!'})
        }

        const productId = req.body._id
        const product = await ProductsModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден!'})
        }

        cart.products.push(product)
        cart.totalCount += 1
        cart.totalPrice += product.price
        await cart.save()

        res.json(cart)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.id
        const cart = await CartModel.findById(cartId)
        if (!cart) {
            return res.status(404).json({ message: 'Корзина не найдена!'})
        }

        const productId = req.body._id
        const product = await ProductsModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден!'})
        }

        if (cart.totalCount <= 0 && cart.totalPrice <= 0) {
            return res.status(404).json({ message: 'Нечего удалять'})
        }

        await cart.products.pop(product)
        cart.totalCount -= 1
        cart.totalPrice -= product.price

        cart.save()
        res.json(cart)


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}