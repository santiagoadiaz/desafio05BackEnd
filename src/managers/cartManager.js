import fs from 'fs';
import Path from '../path.js'
const path = Path
import ProductManager from "../managers/productsManager.js";
const productManager = new ProductManager

export default class CartManager {
    constructor() {
        this.pathCart = `${path}/json/carts.json`;
    }
    async getAllCarts() {
        try {
            if (fs.existsSync(this.pathCart)) {
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            } else {
                await fs.promises.writeFile(this.pathCart, JSON.stringify([]));
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            }
        } catch (error) {
            console.log(error)
        }
    }
    async generateCart(idCart) {
        try {
            let newCart = [];
            if (idCart) {
                newCart = {
                    id: idCart,
                    products: []
                };
            } else {
                newCart = {
                    id: productManager.generateId(),
                    products: []
                };
            }
            const cartsFile = await this.getAllCarts();
            cartsFile.push(newCart);
            await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
            return newCart;
        } catch (error) {
            console.log(error)
        }
    }
    async findCartsByIdCart(searchedId) {
        try {
            const carts = await this.getAllCarts();
            let cartFind = carts.find((cartIterated) => cartIterated.id === searchedId);
            if (cartFind) {
                return cartFind;
            } else {
                cartFind = await this.generateCart(searchedId)
                return cartFind
            }
        } catch (error) {
            console.log(error)
        }
    }
    async findProductInCart(cartId, productId) {
        try {
            const findCart = await this.findCartsByIdCart(cartId)
            if (findCart) {
                const products = findCart.products
                const findProduct = products.find((prodIterated) => prodIterated.id === productId);
                if (findProduct) {
                    return findProduct;
                } else {
                    return null;
                }
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }
    async addProductToCart(idCart, idProduct) {
        try {
            const productFindInProducts = await productManager.findProductByIdProducts(idProduct)
            console.log(productFindInProducts)
            if (productFindInProducts) {
                const cartToAdd = await this.findCartsByIdCart(idCart)
                let carts = await this.getAllCarts();
                let productFound = await this.findProductInCart(idCart, idProduct);
                if (productFound === null) {
                    productFound = {
                        amount: 1,
                        id: idProduct
                    }
                    cartToAdd.products.push(productFound)
                } else {
                    productFound.amount = productFound.amount + 1
                    cartToAdd.products = cartToAdd.products.filter((prod) => prod.id !== idProduct)
                    cartToAdd.products.push(productFound)
                }
                carts = carts.filter((cart) => cart.id !== idCart)
                carts.push(cartToAdd)
                await fs.promises.writeFile(this.pathCart, JSON.stringify(carts));
                return productFound.id
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(idCart, idProduct) {
        try {
            const cartToDelete = await this.findCartsByIdCart(idCart)
            let carts = await this.getAllCarts();
            let productFound = await this.findProductInCart(idCart, idProduct);
            if (productFound) {
                if (productFound.amount < 2) {
                    cartToDelete.products = cartToDelete.products.filter((prod) => prod.id !== idProduct);
                } else {
                    cartToDelete.products = cartToDelete.products.filter((prod) => prod.id !== idProduct);
                    productFound.amount = productFound.amount - 1
                    cartToDelete.products.push(productFound)
                }
                carts = carts.filter((cart) => cart.id !== idCart)
                carts.push(cartToDelete)
                await fs.promises.writeFile(this.pathCart, JSON.stringify(carts));
                return productFound.id
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }
}