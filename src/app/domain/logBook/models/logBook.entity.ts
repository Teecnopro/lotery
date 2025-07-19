import { AuthUser } from "../../auth/models/auth-user.entity";

export interface LogBook {
    uid?: string;
    user: AuthUser;
    action: string;
    module: string;
    description: string;
    date: number;
}
