const express = require('express');
const router = express.Router();
const path = require ("path"); 
const filePath = pat.join(__dirname ,"..", "..", "data", "cart.json");
const CartManager = require('../../managers/cartManager');

const cartManager = new cartManager(filePath);

// Ruta GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId); // método del manager para obtener el cart

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        console.error('Error al obtener los productos del carrito', error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await cartManager.getCartById(cartId); 

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            const existingProduct = cart.products.find((p) => p.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            res.status(200).json(cart.products);
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


// Ruta POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart(); // Método del manager para agregar un nuevo carrito

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al agregar el carrito', error);
        res.status(500).json({ error: 'Error al agregar el carrito' });
    }
});

module.exports = router;
