import knex from "../database/connection";
import { Request, Response } from "express";

class PointController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItem = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_item", "points.id", "=", "point_item.point_id")
      .whereIn("point_item.item_id", parsedItem)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json(points);
  }
  // REQUEST PARAMS : SOMENTE QUANDO É UM PARAMETRO OBRIGATORIO, NORMALMENTE ID
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found" });
    }

    const items = await knex("items")
      .join("point_item", "items.id", "=", "point_item.item_id")
      .where("point_item.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  // REQUEST BODY : SOMENTE PARA CRIAÇÃO E EDIÇÃO
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      watsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const transactionsKnex = await knex.transaction();

    const point = {
      image: "image-fake",
      name,
      email,
      watsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    try {
      const getId = await transactionsKnex("points").insert(point);

      const point_id = getId[0];

      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

      await transactionsKnex("point_item").insert(pointItems);

      await transactionsKnex.commit();

      return response.json({
        id: point_id,
        ...point,
      });
    } catch (err) {
      return response.send(err);
    }
  }
}

export default PointController;
