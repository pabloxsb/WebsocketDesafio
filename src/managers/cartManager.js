import fs from 'fs'
import { ProductManager } from './productManager.js'

const productManager = new ProductManager('./src/data/products.json')

export class CartsManager {
    constructor(path) {
        this.path = path
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf-8')
                const cartsJs = JSON.parse(carts)
                return cartsJs
            } else {
                if (this.carts.length === 0) {
                    return "List empty";
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getCartId() {
        let maxId = 0;
        const carts = await this.getCarts()
        carts.map((cart) => {
            if (cart.cid > maxId) {
                maxId = cart.cid;
            }
            return maxId;
        });
        return maxId;
    }


    async addCart() {
        try {
            const newCart = {
                cid: (await this.getCartId()) + 1,
                products: [],
            };

            const cartFile = await this.getCarts();
            cartFile.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(cartFile));

            return "Cart added successfully";
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            if (carts.length === 0) {
                return "List empty";
            } else {
                const cartId = carts.find(cart => cart.cid === cid);
                if (cartId) {
                    return cartId;
                } else {
                    return "Not found";
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    async saveProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((cart) => cart.cid === cid);
        if (cartIndex === -1) {
            return "Cart not found";
        }

        const prodExists = await productManager.getProductById(pid)
        if (prodExists === null) {
            return "Product not found";
        }

        const cart = carts[cartIndex];
        const prodIndex = cart.products.findIndex((prod) => prod.id === pid);

        if (prodIndex !== -1) {
            cart.products[prodIndex].quantity += 1;
        } else {
            const newProduct = {
                id: pid,
                quantity: 1,
            };
            cart.products.push(newProduct);
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cart;
    }
}