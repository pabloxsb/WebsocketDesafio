import fs from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8')
                const productsJSON = JSON.parse(products)
                return productsJSON
            } else {
                console.log("List empty")
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getId() {
        let maxId = 0;
        const products = await this.getProducts()
        products.map((prod) => {
            if (prod.id > maxId) {
                maxId = prod.id;
            }
            return maxId;
        });
        return maxId;
    }


    async addProduct(obj) {
        try {
            const newProduct = {
                id: (await this.getId()) + 1,
                status: true,
                ...obj,
            };

            const productFile = await this.getProducts();
            productFile.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(productFile));

            return "Product added successfully";
        } catch (error) {
            console.log(error);
        }
    }


    async getProductById(pid) {
        try {
            const products = await this.getProducts();
            if (products.length === 0) {
                return "List empty";
            } else {
                const prodId = products.find(product => product.id === pid);
                if (prodId) {
                    return prodId;
                } else {
                    return "Not found";
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productFile = await this.getProducts();

            const index = productFile.findIndex(product => product.id === id);
            if (index === -1) {
                return "Not found";
            }

            productFile[index] = { ...productFile[index], ...updatedProduct };

            await fs.promises.writeFile(this.path, JSON.stringify(productFile));

            return "Product updated successfully";

        } catch (error) {
            console.log(error);
            return "Error updating the product";
        }
    }


    async deleteProduct(pid) {
        try {
            const productFile = await this.getProducts();

            const index = productFile.findIndex(product => product.id === pid);
            if (index === -1) {
                return "Not found";
            }

            productFile.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(productFile));

            return "Product deleted successfully: ";

        } catch (error) {
            console.log(error);
        }
    }

}        