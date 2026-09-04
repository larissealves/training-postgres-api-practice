import express, { Router } from 'express';
import {checklogin} from '../../../database/queries/login/login.js'

const router = express.Router();

router.get('/login', async (req, res) => {
    const userName =  req.query.userName;
    const userPassword = req.query.userPassword;

    try{
        const checkLogin = await checklogin(userName, userPassword);

        const loginIsValid =  res.status(200).json({
            loginIsValid: checkLogin,
        });

        return loginIsValid;

    }catch(error){
        console.log('Error ao checar login: ', error.message);
        res.status(500).json({
            message: "Error ao checar login."
        })
    }
});

export default router;