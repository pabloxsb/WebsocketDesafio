import { Router } from "express";
import { ProductManager } from '../managers/productManager.js'

const router = Router()

const productManager = new ProductManager('./src/data/products.json')


// router vista productos

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render('home', { products })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router 