import express from 'express';
import mongoose from "mongoose";
import multer from "multer";
import {registerValidation, loginValidation, productCreateValidation} from "./validations/validation.js";
import { UserController, ProductsController, CartController } from "./controllers/index.js"
import {checkAuth, handleValidationErrors} from "./utils/index.js";


mongoose.connect('mongodb+srv://sarioxss:awRXAsfvVzk5fw2E@cluster0.xcxxeyl.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch(err => console.log('DB error: ' + err.message))
const app = express();

app.get('/', (req, res) => {
    res.json({"success": true})
})

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});



const upload = multer({
    storage,
})

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/products/', ProductsController.getAll)
app.get('/products/:id', ProductsController.getProduct)
app.post('/products/', checkAuth, productCreateValidation, handleValidationErrors, ProductsController.createProduct)
app.delete('/products/:id', checkAuth, ProductsController.deleteProduct)
app.patch('/products/:id', checkAuth, productCreateValidation, handleValidationErrors, ProductsController.updateProduct)

app.get('/cart/:id', checkAuth, CartController.getCart)
app.post('/cart/:id', checkAuth, CartController.addProductToCart)
app.delete('/cart/:id', checkAuth, CartController.deleteProductFromCart)

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`Example app listening at http://localhost:${port}`)
});