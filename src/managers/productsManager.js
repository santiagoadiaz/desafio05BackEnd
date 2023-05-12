import fs from 'fs';
import Path from '../path.js'
const path = Path

export default class ProductManager {
    constructor() {
        this.pathProducts = `${path}/json/products.json`;
    }
    async getProducts() {
        try {
            if (fs.existsSync(this.pathProducts)) {
                const productsJSON = await fs.promises.readFile(this.pathProducts, 'utf-8');
                const products = JSON.parse(productsJSON);
                return products
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }
    async repeatedCode(code, productsFile) {
        try {
            const findCode = productsFile.find((prodIterated) => prodIterated.code === code);
            return findCode
        } catch (error) {
            console.log(error)
        }
    }
    generateId() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }
    async createProducts(product) {
        try {
            const productsFile = await this.getProducts();
            let findCode = await this.repeatedCode(product.code, productsFile)
            console.log(product)
            if (findCode) {
                console.log("Error: the product code already exists")
            } else {
                product.id = this.generateId(),
                    productsFile.push(product);
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            }
        } catch (error) {
            console.log(error);
        }
    }
    async updateProduct(id, updateKey, updateValue) {
        try {
            if (updateKey === 'title' || updateKey === 'description' || updateKey === 'code' || updateKey === 'price'
                || updateKey === 'status' || updateKey === 'stock' || updateKey === 'category' || updateKey === 'thumbnails') {
                let productsFile = await this.getProducts();
                let productFind = await this.findProductByIdProducts(id, this.getProducts());
                productsFile = productsFile.filter((product) => product.id !== id);
                productFind[updateKey] = updateValue
                productsFile.push(productFind)
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
            } else {
                console.log('Error: upDateKey debe ser una propieda valida');
            }
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProduct(id) {
        try {
            const productFind = await this.findProductByIdProducts(id, this.getProducts())
            if (productFind) {
                let productsFile = await this.getProducts();
                productsFile = productsFile.filter((product) => product.id !== productFind.id);
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
                return productFind.id
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }
    async findProductByIdProducts(searchedId) {
        try {
            const products = await this.getProducts();
            const find = products.find((prodIterated) => prodIterated.id === searchedId);
            if (find) {
                return find;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }
    async deleteAll() {
        try {
            if (fs.existsSync(this.pathProducts)) {
                await fs.promises.unlink(this.pathProducts)
                return this.pathProducts
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }
}