import { AuthUser } from "../../auth/models/auth-user.entity";

export interface AlertParameterization {
    uid?: string;
    id?: string;
    digits?: number;
    value?: number;
    description?: string;
    createdBy?: AuthUser | null;
    updatedBy?: AuthUser | null;
    createdAt?: number;
    updatedAt?: number;
}