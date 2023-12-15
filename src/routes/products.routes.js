const { Router, response } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const ProductsController = require('../controllers/ProductsController')
const ProductAvatarController = require('../controllers/ProductAvatarController')
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const productsRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const productsController = new ProductsController()
const productAvatarController = new ProductAvatarController()

productsRoutes.get("/", productsController.index)
productsRoutes.post("/", ensureAuthenticated, upload.single("avatar"), productsController.create)
productsRoutes.get("/:id", productsController.show)
productsRoutes.delete("/:id", ensureAuthenticated, productsController.delete)
productsRoutes.patch("/:id", ensureAuthenticated, upload.single("avatar"), productAvatarController.update)


module.exports = productsRoutes