import express from "express";
import {getDish, createDish} from '../../database/queries/dishQueries.js'

const router = express.Router();

router.get(`/dishes`, 
    async (req, res) => {

    const { name, category, tags, ingredients, currentPage, limit} = req.query;

    const filters = {
        tags: tags,
        ingredients: ingredients,
        category: category,
        name: name,
    }
    
    try {
        const listDishes = await getDish(currentPage, limit, filters);
        //console.log("DO DB PARA ENDPOINT:", listDishes)

        const totalItems =  listDishes.totalItems;

        res.status(200).json({
            data: listDishes.data,
            pagination: {
                totalPages: Number(Math.ceil(totalItems / limit)),
                currentPage:  Number(currentPage),
                limit: Number(limit),
            }
        });
    }
    catch(error) {
        console.log('Endpoint GET /dishes:', error);
        res.status(500).json({
            error: "Internal server error",
            message: "Erro ao carregar a lista de pratos."
        });
    }

});


router.post(`/dish`, async (req, res) => {
    const form = {
        name: req.name ,
        price: req.price,
        description: req.description,
        createdAt: req.createdAt,
        isActive: req.isActive,
        categoryId: req.categoryId,
        tagsId: req.tagsId,
        ingredientsId: req.ingredientsId,
    }

    console.log("FORM PARA SALVAR: ", form)
    try {
        const sendForm =  await createDish(form);

        res.status(200).json({
            data: sendForm,
            message: "Prato adicionado com sucesso"
        })

    } catch(error) {
        res.status(500).json({
            error: "Endpoint - não foi possível adicionar o prato",
        })
    }
});

export default router;