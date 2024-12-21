const express = require('express');
const { addToCart, removeFromCart, updateCart } = require('../controllers/cartController'); // Import both methods
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a product to the cart
router.post('/add', authMiddleware, addToCart);

// Route to remove a product from the cart
router.delete('/remove', authMiddleware, removeFromCart);

// Route to update a product from the cart
router.put('/update',authMiddleware,updateCart)

module.exports = router;
