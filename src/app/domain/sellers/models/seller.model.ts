import { AuthUser } from "../../auth/models/auth-user.entity"

export interface ISeller {
    id?: string
    uid?: string
    code?: string
    state?: boolean
    name?: string
    createdAt?: Date
    updatedAt?: Date
    createdBy?: AuthUser
    updatedBy?: AuthUser
}