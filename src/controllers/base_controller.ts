import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseConstroller<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req:Request, res:Response){
        console.log("getAllBooks");
        try{
            if(req.query.name){
                const books =  await this.model.find();
                res.send(books);
            } else {
                const books = await this.model.find();
                res.send(books);
            }
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }

    async getById(req: Request, res: Response) {
        console.log("getBookById:" + req.params.id);
        try {
            const student = await this.model.findById(req.params.id);
            res.send(student);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        console.log("postBook:", req.body);
        const { name } = req.body;
        try {
            const existingBook = await this.model.findOne({ name });
            if (existingBook) {
                return res.status(406).json({ message: "Duplicate book entry" });
            }
            const obj = await this.model.create(req.body);
            res.status(201).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    // async post(req: Request, res: Response) {
    //     console.log("postBook:" + req.body);
    //     try {
    //         const obj = await this.model.create(req.body);
    //         res.status(201).send(obj);
    //     } catch (err) {
    //         console.log(err);
    //         res.status(406).send("fail: " + err.message);
    //     }
    // }



    async putById(req: Request, res: Response) {
        console.log("putStudent:" + req.body);
        try {
            await this.model.findByIdAndUpdate(req.params.id, req.body);
            const obj = await this.model.findById(req.params.id);
            res.status(200).send(obj);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    async deleteById(req: Request, res: Response) {
        console.log("deleteById:" + req.body);
        try {
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send("OK");
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseConstroller<ModelType>(model);
}

export default createController;