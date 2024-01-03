"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = __importDefault(require("../models/order_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const orderController = (0, base_controller_1.default)(order_model_1.default);
exports.default = orderController;
// class ReviewController extends BaseController<IOrder> {
//     constructor() {
//         super(Order);
//     }
//     async getAllOrders(req: Request, res: Response) {
//         try {
//           const orders = await this.model.find();
//           console.log("this.model", typeof this.model)
//           res.status(200).send(orders);
//         } catch (err) {
//           res.status(500).json({ message: err.message });
//         //   super.get(req, res);
//         }
//       }
//     //   async getOrderById(req: Request, res: Response) {
//     //     try {
//     //       const order = await this.model.findById(req.params.id);
//     //       if (!order) {
//     //         res.status(404).json({ message: "Order not found" });
//     //         return;
//     //       }
//     //       res.send(order);
//     //     } catch (err) {
//     //       res.status(500).json({ message: err.message });
//     //     }
//     //     super.get(req, res);
//     //   }
//       async createOrder(req: Request, res: Response) {
//         try {
//           const newOrder = await this.model.create(req.body);
//           res.status(201).send(newOrder);
//         } catch (err) {
//           res.status(406).send("fail: " + err.message);
//         }
//         super.post(req, res);
//       }
//       async updateOrder(req: Request, res: Response) {
//         try {
//           await this.model.findByIdAndUpdate(req.params.id, req.body);
//           const updatedOrder = await this.model.findById(req.params.id);
//           res.status(200).send(updatedOrder);
//         } catch (err) {
//           res.status(406).send("fail: " + err.message);
//         }
//         super.putById(req, res);
//       }
//       async deleteOrder(req: Request, res: Response) {
//         try {
//           await this.model.findByIdAndDelete(req.params.id);
//           res.status(200).send("OK");
//         } catch (err) {
//           res.status(406).send("fail: " + err.message);
//         }
//         super.deleteById(req, res);
//       }
//     }
// export default new ReviewController();
//# sourceMappingURL=order_controller.js.map