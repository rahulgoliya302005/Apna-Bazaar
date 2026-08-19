
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(async () => {

    const products = [
      {
        name: "Wireless Headphones",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        category: "Electronics",
        description: "Wireless Bluetooth headphones",
        rating: 4.5,
        stock: 20
      },
      {
        name: "Smart Watch",
        price: 2499,
        image: "https://via.placeholder.com/500",
        category: "Electronics",
        description: "Smart fitness watch",
        rating: 4.3,
        stock: 15
      }
    ];

    await Product.insertMany(products);

    console.log("Products added successfully");

    process.exit();
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
