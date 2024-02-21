import {users} from '@prisma/client'

export interface ServiceCreateRes {
    err: any,
    data: null | users
}