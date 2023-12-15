const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class ProductAvatarController{
    async update(request, response){
        const product_id = request.params.id
        const avatarFilename = request.file.filename

        const product = await knex("products")
        .where({ id: product_id }).first()
        

        const diskStorage = new DiskStorage

        if(!product){
            throw new AppError("Somente usuários admin podem alterar foto do produto", 401)
        }

        if(product.avatar){
            await diskStorage.deleteFile(product.avatar)
        }

        const filename = await diskStorage.saveFile(avatarFilename)
        product.avatar = filename

        await knex("products").update(product).where({ id: product_id })

        return response.json(product)
    }
}

module.exports = ProductAvatarController