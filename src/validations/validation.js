import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const productCreateValidation = [
    body('title', 'Введите наименование товара').isLength({min: 3}).isString(),
    body('description', 'Введите описание товара').isLength({min: 10}).isString(),
    body('price', 'Введите стоимость товара').isNumeric(),
    body('productImg', 'Введите ссылку на изображение продукта').optional().isURL(),
    body('category', 'Выберите категорию товара')
]