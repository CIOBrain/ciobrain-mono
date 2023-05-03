import dotenv from 'dotenv';
import { Router } from "express"
dotenv.config();

const authenticateRouter = Router()

const checkAuth = (req, res, next) => {
    console.log(req.body)
    if (req.body.pass === process.env.PASSWORD) {
        res.status(200).send('Success')
        return;
    }
    res.status(401).send('Not Authorized')
}

//was giving errors so I commented the implementation out
//because req.body doesn't have a password
export const authenticate = (req, res, next) => {
    console.log(req.body)
    if (req.body.password === process.env.PASSWORD) {
        next();
        return;
    }
    res.status(401).json({ error: "Not authenticated" })
}

authenticateRouter.post('/', checkAuth)

export default authenticateRouter;