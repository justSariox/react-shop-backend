import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";

export const register = async (req, res) => {
    try {
        const { password, email, fullName, avatarUrl } = req.body;

        const hash = await bcrypt.hash(JSON.stringify(password), 10);

        const cart = await new Cart({
            userId: null,
            products: [],
            totalCount: 0,
            totalPrice: 0
        }).save();

        const user = await new UserModel({
            email,
            fullName,
            avatarUrl,
            passwordHash: hash,
            cart: cart._id
        }).save();

        cart.userId = user._id;
        await cart.save();

        const token = jwt.sign({ _id: user._id }, 'othjerygjuers8yt9e45896ty', { expiresIn: '30d' });
        const { passwordHash, ...userData } = user.toObject();

        res.json({ ...userData, cart: cart._id, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
}
export const login = async (req, res) => {
    const {email} = req.body

    try {
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден!'})
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({message: 'Неверный логин или пароль'})
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'othjerygjuers8yt9e45896ty', {
            expiresIn: '30d'
        })

        const {passwordHash, ...userData} = user._doc
        res.json({...userData, token})
    } catch (e) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден!'
            })
        }

        const {passwordHash, ...userData} = user._doc
        res.json(userData)
    } catch (e) {
        console.log(err)
        res.status(500).json({
            message: 'Что-то пошло не так!'
        })
    }
}