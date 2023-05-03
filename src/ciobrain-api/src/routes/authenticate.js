import dotenv from 'dotenv';
import { Router } from "express"
dotenv.config();

const authenticateRouter = Router()

const checkAuth = (req, res, next) => {
    console.log(req.body)
    if (req.body.pass === process.env.REACT_APP_PASSWORD) {
        res.status(200).send('Success')
        return;
    }
    res.status(401).send(`Not Authorized, expected pass: ${process.env.REACT_APP_PASSWORD}`)
}

//was giving errors because req.body doesn't have a password.
// Don't think this is necessary so I commented the definition out
export const authenticate = (req, res, next) => {
    console.log(req.body)
    if (req.body.password === process.env.REACT_APP_PASSWORD) {
        next();
        return;
    }
    res.status(401).json({ error: "Not authenticated" })
}

authenticateRouter.post('/', checkAuth)

export default authenticateRouter;