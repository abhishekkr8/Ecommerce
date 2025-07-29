const express = require("express");

const {
  addProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);
router.put("/:reviewId", updateProductReview);
router.delete("/:reviewId", deleteProductReview);


module.exports = router;
