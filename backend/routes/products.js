const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// ===============================
// GET ALL PRODUCTS
// ===============================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products"
    });
  }
});

// ===============================
// GET SINGLE PRODUCT
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch product"
    });
  }
});

// ===============================
// ADD PRODUCT
// ===============================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      category,
      description,
      rating,
      stock
    } = req.body;

    if (!name || !price || !image || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, image and category are required"
      });
    }

    const product = await Product.create({
      name,
      price,
      image,
      category,
      description,
      rating,
      stock
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create product"
    });
  }
});

module.exports = router;