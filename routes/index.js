var express = require("express");
var router = express.Router();

var pageController = require("../controllers/pageController");
var userController = require("../controllers/userController");

var authMiddleware = require("../middlewares/authMiddleware");

var passport = require("passport");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
/* GET home page. */
//logout
  router.get("/a", (req, res, next) => {
    res.render('shop/index')
  });
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});
//public
router.get("/", authMiddleware.isLoggedAll, pageController.indexPage);
router.get("/login", authMiddleware.isLoggedAll, pageController.loginPage);

router.get(
  "/register",
  authMiddleware.isLoggedAll,
  pageController.registerPage
);

router.post("/registerInsert", userController.insertUser);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login?message=loginFail",
  }),
  userController.login
);
//admin
router.get(
  "/indexAdmin",
  authMiddleware.isLoggedAdmin,
  pageController.indexAdmin
);
router.get(
  "/admin_paid",
  authMiddleware.isLoggedAdmin,
  pageController.admin_paid
);
router.get(
  "/admin_cancel",
  authMiddleware.isLoggedAdmin,
  pageController.admin_cancel
);
router.get(
  "/report",
  authMiddleware.isLoggedAdmin,
  pageController.report
);
router.get(
  "/delete_user",
  authMiddleware.isLoggedAdmin,
  pageController.delete_user
);
router.get(
  "/manage",
  authMiddleware.isLoggedAdmin,
  pageController.manage
);
router.get(
  "/admin_done",
  authMiddleware.isLoggedAdmin,
  pageController.admin_success
);
router.get(
  "/admin_send",
  authMiddleware.isLoggedAdmin,
  pageController.admin_send
);
router.post(
  "/change_cancel/:id",
  authMiddleware.isLoggedAdmin,
  userController.change_cancel
);
//type admin
router.get(
  "/typeAdmin",
  authMiddleware.isLoggedAdmin,
  pageController.adminType
);
router.get(
  "/typeDelete/:id",
  authMiddleware.isLoggedAdmin,
  userController.typeDelete
);
router.post(
  "/typeInfo/:id",
  authMiddleware.isLoggedAdmin,
  userController.typeInfo
);
router.post("/typeEdit", authMiddleware.isLoggedAdmin, userController.typeEdit);
router.post(
  "/typeInsert",
  authMiddleware.isLoggedAdmin,
  userController.typeInsert
);
//product admin
router.get(
  "/productAdmin",
  authMiddleware.isLoggedAdmin,
  pageController.adminProduct
);
router.get(
  "/productAdd",
  authMiddleware.isLoggedAdmin,
  pageController.adminAdd
);
router.post(
  "/productInsert",
  authMiddleware.isLoggedAdmin,
  userController.productInsert
);
router.post(
  "/productEdit",
  authMiddleware.isLoggedAdmin,
  userController.productEdit
);
router.get(
  "/productStock",
  authMiddleware.isLoggedAdmin,
  pageController.productStock
);
router.post(
  "/stockInsert",
  authMiddleware.isLoggedAdmin,
  userController.stockInsert
);
router.post(
  "/stockInfo",
  authMiddleware.isLoggedAdmin,
  pageController.stockInfo
);
router.post(
  "/stockProduct",
  authMiddleware.isLoggedAdmin,
  pageController.stockProduct
);
router.get(
  "/stockDelete/:id",
  authMiddleware.isLoggedAdmin,
  userController.stockDelete
);
router.post(
  "/stockOneInfo",
  authMiddleware.isLoggedAdmin,
  userController.stockOneInfo
);
router.post(
  "/stockEdit",
  authMiddleware.isLoggedAdmin,
  userController.stockEdit
);
router.post(
  "/editImageStock",
  authMiddleware.isLoggedAdmin,
  upload.single("image"),
  userController.editImageStock
);
router.get(
  "/adminCount",
  authMiddleware.isLoggedAdmin,
  pageController.adminCount
);
router.post(
  "/adminCountInfo",
  authMiddleware.isLoggedAdmin,
  pageController.adminCountInfo
);
router.post(
  "/adminCountInfo_filter",
  authMiddleware.isLoggedAdmin,
  pageController.adminCountInfo_filter
);
router.get(
  "/stockDeleteCount/:id",
  authMiddleware.isLoggedAdmin,
  userController.stockDeleteCount
);
router.post(
  "/stockEditCount",
  authMiddleware.isLoggedAdmin,
  userController.stockEditCount
);
router.post("/stockAdd", authMiddleware.isLoggedAdmin, userController.stockAdd);
router.post(
  "/productDeleteAll",
  authMiddleware.isLoggedAdmin,
  userController.productDeleteAll
);
router.post("/insert_color", authMiddleware.isLoggedAdmin, upload.single("image"), userController.insert_color);
router.post("/edit_colorImage", authMiddleware.isLoggedAdmin, upload.single("image"), userController.edit_colorImage);
router.post("/edit_color", authMiddleware.isLoggedAdmin, userController.edit_color);
router.post("/check_edit_color", authMiddleware.isLoggedAdmin, userController.check_edit_color);
router.post("/edit_size", authMiddleware.isLoggedAdmin, userController.edit_size);
router.post("/check_edit_size", authMiddleware.isLoggedAdmin, userController.check_edit_size);
router.post("/insert_size", authMiddleware.isLoggedAdmin, userController.insert_size);
router.post("/show_color", authMiddleware.isLoggedAdmin, userController.show_color);
router.post("/show_size", authMiddleware.isLoggedAdmin, userController.show_size);
router.post("/delete_color", authMiddleware.isLoggedAdmin, userController.delete_color);
router.post("/delete_size", authMiddleware.isLoggedAdmin, userController.delete_size);
router.post("/stockOneInfo_image", authMiddleware.isLoggedAdmin, pageController.stockOneInfo_image);
router.get("/change_user",pageController.change_user);
router.post("/change_status2", authMiddleware.isLoggedAdmin,userController.change_status2);
router.post("/change_status3/:id", authMiddleware.isLoggedAdmin,userController.change_status3);
//user
router.get("/list",authMiddleware.isLoggedUser,pageController.list);
router.get("/send",authMiddleware.isLoggedUser,pageController.send);
router.get("/done",authMiddleware.isLoggedUser,pageController.done);
router.get("/cancel",authMiddleware.isLoggedUser,pageController.cancel);
router.get("/detail",pageController.detail);
router.get("/address",authMiddleware.isLoggedUser,pageController.address);
router.get("/basket",authMiddleware.isLoggedUser,pageController.basket);
router.get("/pay",authMiddleware.isLoggedUser,pageController.pay);
router.get("/paid",authMiddleware.isLoggedUser,pageController.paid);
router.get("/wait",authMiddleware.isLoggedUser,pageController.wait);
router.get("/send",authMiddleware.isLoggedUser,pageController.send);
router.post("/list_image/:id",authMiddleware.isLoggedUser,upload.single("image"), userController.list_image)
router.post("/list",authMiddleware.isLoggedUser,userController.list);
router.post("/check",authMiddleware.isLoggedUser,userController.check);



router.get('/check',pageController.check)

router.post("/list_product",userController.list_product);
router.post("/change_bank",userController.change_bank);
router.post("/info_address",userController.info_address);
router.post("/user_address",userController.user_address);
router.post("/user_address_pay",userController.user_address_pay);
router.post("/user_address_n",userController.user_address_n);
router.get("/delete_address",userController.delete_address);

router.get("/indexUser", authMiddleware.isLoggedUser, pageController.indexUser);
router.get("/user_edit", authMiddleware.isLoggedUser, pageController.user_edit);
router.post("/user_edit", authMiddleware.isLoggedUser, userController.user_edit);
router.post("/edit_userImage", authMiddleware.isLoggedUser,upload.single("image"),   userController.edit_userImage);
router.post("/show_user", authMiddleware.isLoggedUser, pageController.show_user);
router.post("/edit_password",authMiddleware.isLoggedUser, userController.edit_password);
router.post("/basket",authMiddleware.isLoggedUser,userController.basket);
router.post("/basket_status",authMiddleware.isLoggedUser,pageController.basket_status);
router.post("/basket_qty",authMiddleware.isLoggedUser,pageController.basket_qty);
router.post("/basket_sum",authMiddleware.isLoggedUser,pageController.basket_sum);
router.get("/basket_delete",authMiddleware.isLoggedUser,pageController.basket_delete);



router.post("/showType",pageController.showType);
router.post("/product_show_all",pageController.product_show_all);
router.post("/product_show_dee",pageController.product_show_dee);

router.post("/product_show_image",pageController.product_show_image);
router.post("/product_show_new",pageController.product_show_new);
router.get("/indexAllv2",pageController.productAllv2);
router.get("/indexNew",pageController.productNew);
router.post("/productNew_show",pageController.productNew_show);
router.get("/indexType",pageController.product_type);
router.post("/productType_show",pageController.productType_show);
router.get("/product_detail",pageController.product_detail);
router.post("/product_detail_one",pageController.product_detail_one);
router.post("/product_detail_color",pageController.product_detail_color);
router.post("/product_detail_size",pageController.product_detail_size);
router.post("/show_stock_count",pageController.show_stock_count);
router.post("/product_match_size",pageController.product_match_size);
router.post("/product_match_color",pageController.product_match_color);


//new Shop


module.exports = router;
