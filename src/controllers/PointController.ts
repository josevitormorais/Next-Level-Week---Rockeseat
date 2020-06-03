import knex from "../database/connection";
import { Request, Response } from "express";

class PointController {
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
