import express from "express"
import cors from "cors"
import assetRouter from "./src/routes/asset.js"
import authenticateRouter from "./src/routes/authenticate.js";
import loggingController from "./src/controller/loggingController.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 3002
const app = express()

// setup swagger-jsdoc swagger gen
//const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // files containing annotations as above
}

const openapiSpecification = swaggerJSDoc(options);

// setup swagger gen and host
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(cors())
app.options("*", cors())
app.use(express.json())
app.use("/asset", assetRouter)
app.use("/auth", authenticateRouter)
app.post("/log", loggingController.push)

app.listen(PORT, _ => console.log(`Connected to the server ${PORT}`))
