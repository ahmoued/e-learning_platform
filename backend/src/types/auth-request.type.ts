//import { Request } from "@nestjs/common";
import { Request } from "express";
export interface AuthRequest extends Request{
    user?: {
        id: string,
        full_name: string,
        role:string
    };
}