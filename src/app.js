import express from 'express'
import { __dirname } from './utils.js'
import productRouter from '../src/routes/product.router.js'
import cartRouter from '../src/routes/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from '../src/routes/views.router.js'
import { Server } from 'socket.io'


import { ProductManager } from './managers/productManager.js'

const productManager = new ProductManager(__dirname + '/data/products.json');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/views', viewsRouter)


const httpServer = app.listen(8080, () => console.log("Server OK en puerto 8080"))

const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log('New connection', socket.id)

    socket.on('disconnect', () => {
        console.log('¡User disconnect!', socket.id);
    })


    socket.emit('arrayProducts', await productManager.getProducts());



    socket.on('newProduct', async (obj) => {
        await productManager.addProduct(obj);
        socketServer.emit('arrayProducts', await productManager.getProducts());

    })
})