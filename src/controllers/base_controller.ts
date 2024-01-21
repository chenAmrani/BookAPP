import { Request, Response } from "express";
import { Model } from "mongoose";
//import book_model from "../models/book_model";
//check

// Extend Request interface to include user property
interface AuthRequest extends Request {
    user?: { _id: string; role: string }; // Define the user object properties here
}

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: AuthRequest, res: Response) {
        console.log('getAll');
        try {
            if (req.query.name) {
                const obj = await this.model.find({ name: req.query.name });
                res.send(obj);
            } else {
                if (req.user && req.user.role === 'admin') {
                    // Access to all books for admin
                    const allObjects = await this.model.find();
                    res.send(allObjects);
                } else {
                    // Access to books based on user or default behavior
                    const obj = await this.model.find({ /* Your condition here */ });
                    res.send(obj);
                }
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const book = await this.model.findById(req.params.id);
            res.send(book)  ;
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    
    async post(req: Request, res: Response) {
        try {
            const existingBook = await this.model.findOne({
                name: req.body.name,
                author: req.body.author,
            });

            if (existingBook) {
                res.status(406).send("Book already exists");
                return;
            }

            const obj = await this.model.create(req.body);
            
            res.status(201).send(obj);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }


    async putById(req: Request, res: Response) {
        try {
            const { id, obj } = req.body;
            console.log("The id is: " + id);
            console.log("The obj is: " + obj);
            const updatedBook = await this.model.findByIdAndUpdate(id, obj, { new: true });
            console.log("The updatedBook is: " + updatedBook);
            console.log("The updatedBook is: " + updatedBook);
            res.status(200).send(updatedBook);

        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }





    async deleteById(req: Request, res: Response) {
        // console.log("deleteById:" + req.body);
        try {
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send("OK");
        } catch (err) {
            res.status(406).send("fail: " + err.message);
        }
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;