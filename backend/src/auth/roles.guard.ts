import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean{
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredRoles) return true;
        const {user} = context.switchToHttp().getRequest()
        return requiredRoles.some((roles)=> roles == user.role)

    }
}


