import express from 'express';
import morgan from 'morgan';
import handlebarsProductsRouter from './routes/handlebarsProductsRouter.js'
import Path from './path.js'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import { productPropValidator } from "./middlewares/productPropValidator.js";

import ProductManager from "./managers/productsManager.js";
const productsManager = new ProductManager();

const app = express();
const port = 8080;
const path = Path

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path + '/public'))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path + '/views')

app.use('/handlebars', handlebarsProductsRouter)

const httpServer = app.listen(port, () => {
    console.log('server ok en port', port)
});


app.get('/home', async (req, res) => {
    try {
        res.status(200).render('products')
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
});

const socketServer = new Server(httpServer)
socketServer.on('connection', async (socket) => {
    let arrayProducts = await productsManager.getProducts()
    socket.emit('arrayProducts', arrayProducts);
    socket.on('newProduct', async (obj) => {
        try {
            const prodValidado = productPropValidator(obj)
            if (typeof prodValidado === "object") {
                await productsManager.createProducts(obj)
                arrayProducts = await productsManager.getProducts()
                socket.emit('arrayProducts', arrayProducts);
            } else {
                socket.emit('error', prodValidado);
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    })
    socket.on('deleteProduct', async (id) => {
        await productsManager.deleteProduct(id)
        arrayProducts = await productsManager.getProducts()
        socket.emit('arrayProducts', arrayProducts);
    })
});