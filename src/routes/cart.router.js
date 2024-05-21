import { Router } from "express";
import { CartsManager } from '../managers/cartManager.js'

const router = Router()

const cartManager = new CartsManager('./src/data/carts.json')

// rutas

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid));
        if (cart === "Not found") {
            res.status(404).json({ message: "Cart not found" });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.saveProductToCart(parseInt(cid), parseInt(pid));
        if (cart === "Cart not found") {
            res.status(404).json({ message: "Cart not found" });
        } else if (cart === "Product not found") {
            res.status(404).json({ message: "Product not found" });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router