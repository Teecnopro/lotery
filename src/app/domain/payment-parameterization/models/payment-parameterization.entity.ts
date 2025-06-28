import { AuthUser } from "../../auth/models/auth-user.entity";

export interface PaymentParameterization {
    uid?: string;
    amount?: number;
    digits?: number;
    combined?: boolean;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: AuthUser | null;
    updatedBy?: AuthUser | null;
}