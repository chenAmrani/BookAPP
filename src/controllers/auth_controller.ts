import { Request, Response } from "express";


const register = async(req:Request, res:Response)=>{
    res.status(400).send("unimplented")
}
const login = async(req:Request, res:Response)=>{
    res.status(400).send("unimplented")
}
const logout = async(req:Request, res:Response)=>{
    res.status(400).send("unimplented")
}
export default {
    register,
    login, 
    logout
}
