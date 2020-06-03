import express from "express";
import PointController from "./controllers/PointController";
import ItemController from "./controllers/ItemsControllers";

const routes = express.Router();

const pointController = new PointController();
const itemsController = new ItemController();

routes.get("/items", itemsController.index);

routes.post("/points", pointController.create);
routes.get("/points", pointController.index);
routes.get("/points/:id", pointController.show);

export default routes;
