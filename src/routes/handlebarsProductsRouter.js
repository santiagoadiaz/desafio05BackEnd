import { Router } from "express";
const router = Router();
import ProductManager from "../managers/productsManager.js";
const productsManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const productsFile = await productsManager.getProducts()
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit) {
            const limitedProducts = productsFile.slice(0, limit);
            const remainingProducts = productsFile.slice(limit);
            res.status(200).render('products', { limitedProducts, remainingProducts });
        } else {
            res.status(200).render('products', { productsFile });
        };
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
});
router.get('/socket', async (req, res) => {
    try {
        try {
            const productsFile = await productsManager.getProducts()
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            if (limit) {
                const limitedProducts = productsFile.slice(0, limit);
                const remainingProducts = productsFile.slice(limit);
                res.status(200).render('websockets', { limitedProducts, remainingProducts });
            } else {
                res.status(200).render('websockets', { productsFile });
            };
        } catch (error) {
            res.status(404).json({ message: error.message });
        };
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
});

export default router