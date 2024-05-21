import { Router } from "express";
import { ProductManager } from '../managers/productManager.js'
import { productValidator } from "../middlewares/productValidator.js";
import { uploader } from "../middlewares/multer.js";


const router = Router()

const productManager = new ProductManager('./src/data/products.json')

// rutas

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts()
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.status(200).json(limitedProducts);
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/', productValidator, async (req, res) => {
    try {
        const newProd = req.body
        const addProd = await productManager.addProduct(newProd)
        res.status(200).json(addProd);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const prodId = await productManager.getProductById(parseInt(pid))
        if (prodId) {
            res.json(prodId);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body;
        const prod = await productManager.getProductById(parseInt(pid));
        if (prod) {
            await productManager.updateProduct(parseInt(pid), updatedFields);
            res.json({ message: `Product id: ${pid} updated successfully` });
        } else {
            res.status(400).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const prod = await productManager.getProductById(parseInt(pid));
        if (prod) {
            const deletProd = await productManager.deleteProduct(parseInt(pid));
            res.json(deletProd);
        } else {
            res.status(400).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// router image

router.post('/img', uploader.single('image'), async (req, res) => {
    try {
        const { image, ...productData } = req.body;
        console.log(req.file);

        const newProduct = {
            ...productData,
            profile: req.file.path
        };

        const addedProduct = await productManager.addProduct(newProduct);
        res.status(200).json(addedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router