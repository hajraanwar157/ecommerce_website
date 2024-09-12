const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchErrorHandler = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const cloudinary = require("cloudinary");
//////////////////////////////////////////////////////////////////////
//update product --for admin
exports.updateProduct = catchErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product to be updated not found", 404));
  }
  let images = [];
  // Check if images are coming as a string or array
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  } else {
    return res.status(400).json({ message: "Invalid image format" });
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (const image of images) {
      try {
        // Ensure the image string starts with 'data:image/...' before uploading
        if (image.startsWith("data:image/")) {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } else {
          throw new Error("Invalid base64 format");
        }
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
//////////////////////////////////////////////////////////////////////
//create a new product--for admin
exports.createProduct = catchErrorHandler(async (req, res, next) => {
  let images = [];

  // Check if images are coming as a string or array
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  } else {
    return res.status(400).json({ message: "Invalid image format" });
  }

  const imagesLinks = [];

  for (const image of images) {
    try {
      // Ensure the image string starts with 'data:image/...' before uploading
      if (image.startsWith("data:image/")) {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } else {
        throw new Error("Invalid base64 format");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // const imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "products",
  //   });

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  // req.body.images = imagesLinks;
  // req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
//////////////////////////////////////////////////////////////////////
//delete a product
exports.deleteProduct = catchErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product to be deleted not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  const delProduct = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
    delProduct,
  });
});
//////////////////////////////////////////////////////////////////////
//get All Products
exports.getAllProducts = catchErrorHandler(async (req, res) => {
  const resultPerPage = 6;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

//get All Products (admin)
exports.getAdminProducts = catchErrorHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

///////////////////////////////////////////////////////////////////////
//get single product
exports.getSingleProduct = catchErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
///////////////////////////////////////////////////////////////////////
//craete product reviews or update alreading existing one
exports.createProductReviews = catchErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
///////////////////////////////////////////////////////////////////////
//get all reviews of a product
exports.getProductReviews = catchErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  const reviews = product.reviews;
  res.status(200).json({
    success: true,
    reviews,
  });
});
///////////////////////////////////////////////////////////////////////
//delete a review of a product
exports.deleteProductReview = catchErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  const reviews = product.reviews.filter(
    (rev) => rev.id.toString() !== req.query.id
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  });
  res.status(200).json({
    success: true,
    message: "review deleted successfully",
  });
});
