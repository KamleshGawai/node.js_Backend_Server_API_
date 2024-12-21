const Cart = require('../models/Cart');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid productId or quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // Update existing cart
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    } else {
      // Create new cart
      const newCart = new Cart({ userId: req.user.id, products: [{ productId, quantity }] });
      await newCart.save();
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Update the quantity of a product in the cart
exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid productId or quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (quantity === 0) {
      // Remove the product if the quantity is set to 0
      cart.products.splice(productIndex, 1);
    } else {
      // Update the product quantity
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};
