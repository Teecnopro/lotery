import { AuthUser } from "../../auth/models/auth-user.entity"

export interface ISeller {
    id?: string
    uid?: string
    code?: string
    state?: boolean
    name?: string
    createdAt?: number
    updatedAt?: number
    createdBy?: AuthUser
    updatedBy?: AuthUser
}