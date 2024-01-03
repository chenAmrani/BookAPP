import Order, { IOrder } from "../models/order_model";
import {BaseController} from "./base_controller";
import {Request , Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class ReviewController extends BaseController<IOrder> {
    constructor() {
        super(Order);
    }

    async getAllOrders(req: AuthRequest, res: Response) {
        try {
          const orders = await this.model.find();
          res.send(orders);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }

      async getOrderById(req: AuthRequest, res: Response) {
        try {
          const order = await this.model.findById(req.params.id);
          if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
          }
          res.send(order);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }

      async createOrder(req: AuthRequest, res: Response) {
        try {
          const newOrder = await this.model.create(req.body);
          res.status(201).send(newOrder);
        } catch (err) {
          res.status(406).send("fail: " + err.message);
        }
      }
      async updateOrder(req: AuthRequest, res: Response) {
        try {
          await this.model.findByIdAndUpdate(req.params.id, req.body);
          const updatedOrder = await this.model.findById(req.params.id);
          res.status(200).send(updatedOrder);
        } catch (err) {
          res.status(406).send("fail: " + err.message);
        }
      }
    
      async deleteOrder(req: AuthRequest, res: Response) {
        try {
          await this.model.findByIdAndDelete(req.params.id);
          res.status(200).send("OK");
        } catch (err) {
          res.status(406).send("fail: " + err.message);
        }
      }
    }


export default new ReviewController();
