const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")
const ProductAvatarController = require("./ProductAvatarController")

class ProductsController{
    async create(request, response){
        
        const {title, description, ingredients, value, category} = request.body
        
        const user_id = request.user.id

        const diskStorage = new DiskStorage()

        const avatar = await diskStorage.saveFile(request.file.filename)
        
        const product_id =  await knex("products").insert({
            avatar,
            title,
            description,
            value,
            category,
            user_id
        })
 
    const OneIngredient = typeof(ingredients) === "string";

    let ingredientsInsert
    
    if (OneIngredient) {
      ingredientsInsert = {
        name: ingredients,
        product_id,
        user_id
      }

    } else if (ingredients.length > 1) {
      ingredientsInsert = ingredients.map(ingredient => 
        ({
          name : ingredient,
          product_id,
          user_id
        })
      );

    } else {
      return 
    }
        await knex("ingredients").insert(ingredientsInsert)

        return response.json()
        
    }

    async show(request,response){
        const { id } = request.params

        const product = await knex("products").where({ id }).first()
        const ingredients = await knex("ingredients").where({ product_id: id}).orderBy("name")
        
        return response.json({
            ...product,
            ingredients
        })
    }

    async delete(request, response){
        const { id } = request.params

        await knex("products").where({ id }).delete()

        return response.json()
    }

    async index(request, response){
        const { title, ingredients } = request.query
        
        let products

        if(ingredients){
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

            products = await knex("ingredients")
            .select([
                "products.id",
                "products.title"
                
            ])
            .whereLike("products.title",`%${title}%`)
            .whereIn("name", filterIngredients)
            .innerJoin("products", "products.id", "ingredients.product_id")
            .orderBy("products.title")

        }else{
            products = await knex("products").whereLike("title", `%${title}%`)
            .orWhereLike("description", `%${title}%`)
        }
        
        const userIngredients = await knex("ingredients")
        const productsWithIngredients = products.map(product => {
            const productIngredients = userIngredients.filter( ingredient => ingredient.product_id === product.id)
           

            return {
                ...product,
                ingredients: productIngredients
            }
        })
       
        return response.json(productsWithIngredients)
    }
}

module.exports = ProductsController

// Não foi feito o UPDATE em ProductsController, é necessário fazer