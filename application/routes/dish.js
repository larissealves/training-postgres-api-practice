import express from "express";
import {getDish, createDish} from '../../database/queries/dishQueries.js'
import multer from "multer";

const upload = multer();
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
        
        const formattedDishes = listDishes.data.map(item =>( {

            ...item,
            listImages: (item.listImages ?? [])
            .map(img => {
                const base64 = img.toString("base64");
                return `data:image/webp;base64,${base64}`
            })
        }));
        
        const totalItems =  listDishes.totalItems;

        res.status(200).json({
            data: formattedDishes,
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

router.post(`/dishes`, upload.none(), async (req, res) => {
    const form = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        createdAt: req.body.createdAt,
        isActive: req.body.isActive,
        categoryId: req.body.categoryId,
        tagsId:  JSON.parse(req.body.tagsId),
        ingredientsId:  JSON.parse(req.body.ingredientsId),
    }

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