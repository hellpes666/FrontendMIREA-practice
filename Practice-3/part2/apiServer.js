const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const app = express(); 
app.use(cors());
const PORT = 3000;

app.use(bodyParser.json());

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Product API",
			version: "1.0.0",
			description: "API for managing products",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["apiServer.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Массив для хранения товаров
let products = [];

// API Endpoints
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список товаров
 *     responses:
 *       200:
 *         description: Успешный ответ
 */
app.get("/products", (req, res) => {
	res.json(products);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить новый товар
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно добавлен
 */
app.post("/products", (req, res) => {
	const product = {
		id: products.length + 1,
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
	};
	products.push(product);
	res.status(201).json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлен
 */
app.put("/products/:id", (req, res) => {
	const product = products.find((p) => p.id === parseInt(req.params.id));
	if (!product) return res.status(404).send("Product not found");

	product.name = req.body.name;
	product.price = req.body.price;
	product.description = req.body.description;
	res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID товара
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Товар удален
 */
app.delete("/products/:id", (req, res) => {
	const productIndex = products.findIndex(
		(p) => p.id === parseInt(req.params.id)
	);
	if (productIndex === -1) return res.status(404).send("Product not found");

	products.splice(productIndex, 1);
	res.status(204).send();
});

app.listen(PORT, () => {
	console.log(`API server is running on http://localhost:${PORT}`);
});
