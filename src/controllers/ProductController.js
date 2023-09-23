import ProductsModel from "../models/Products.js";
import UserModel from "../models/User.js";
export const createProduct = async (req, res) => {
    const {title, description, price, productImg, category} = req.body
    try {
        const doc = new ProductsModel({
            title,
            description,
            price,
            productImg,
            category
        });

        const user = await UserModel.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'У вас нет прав на удаление продукта' });
        }

        const product = await doc.save()
        res.json(product)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
}
export const getAll = async (req, res) => {
    try {
        const products = await ProductsModel.find();
        res.json(products)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}
export const getProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await ProductsModel.findById(productId)

        if (!product) {
            return res.status(404).json({message: 'Не удалось найти продукт'})
        }


        res.json(product)
    } catch (e) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}

export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id

        const user = await UserModel.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'У вас нет прав на добавление продукта' });
        }

        const deletedProduct = await ProductsModel.findOneAndDelete({_id: productId})

        if (!deletedProduct) {
            return res.status(404).json({message: 'Продукт не найден!'})
        }

        return res.json({
            message: `Продукт ${deletedProduct.title} был удален`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}

export const updateProduct = async (req, res) => {
    const {title, description, price, productImg, category} = req.body
    try {
        const productId = req.params.id

        const user = await UserModel.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'У вас нет прав на изменение продукта' });
        }

        await ProductsModel.updateOne({
            _id: productId,

        }, {
            title,
            description,
            price,
            productImg,
            category
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}

