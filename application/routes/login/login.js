import express, { Router } from 'express';
import { checklogin } from '../../../database/queries/login/login.js'

const router = express.Router();

router.post('/login', async (req, res) => {
    const userName = req.body.name;
    const userPassword = req.body.password;

    try {
        const login = await checklogin(userName, userPassword);

        if (!login.logginValid) {
            return res.status(401).json({
                user: '',
                loginIsValid: false,
                message: "Usuário inválido ou desativado."
            });
        }

        req.session.user = login.name;

        req.session.save((err) => {
            if (err) {
                console.error('Erro ao salvar sessão:', err);

                return res.status(500).json({
                    message: 'Erro ao salvar sessão.'
                });
            }
        });

        
        const data = res.status(200).json({
            user: login.name,
            loginIsValid: login.logginValid,
            message: 'Login realizado'
        });

        return data;

    } catch (error) {
        console.log('Error ao checar login: ', error.message);
        res.status(500).json({
            message: "Error ao checar login."
        })
    }
});



export default router;