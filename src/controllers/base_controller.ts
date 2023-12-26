import { Request, Response } from "express";
import { Model } from "mongoose";


class BaseController<ModelType>{
model:Model<ModelType>
constructor(model:Model<ModelType>){
    this.model = model
}
    async get(req:Request, res:Response){
        try{
            if(req.query.name){
                const o =  await this.model.find();
                res.send(o);
            } else {
                const o = await this.model.find();
                res.send(o);
            }
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getById(req:Request, res:Response){
        try{
            if(req.query.name){
                const o =  await this.model.find();
                res.send(o);
            } else {
                const o = await this.model.find();
                res.send(o);
            }
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async post(req:Request, res:Response){
        try{
            if(req.query.name){
                const o =  await this.model.find();
                res.send(o);
            } else {
                const o = await this.model.find();
                res.send(o);
            }
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
  putById(req:Request,res:Response){
    res.send("put book by id: " + req.params.id);
  }

  deleteById(req:Request,res:Response){
    res.send("delete book by id: " + req.params.id);
  }
 
}
export default BaseController;