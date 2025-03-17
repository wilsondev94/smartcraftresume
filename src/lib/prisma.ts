import {PrismaClient} from '@prisma/client'

const prismaClientSngleton=()=>{
    return new PrismaClient()
}

declare const globalThis:{
    prismaGlobal:ReturnType<typeof prismaClientSngleton>
}& typeof global

const prisma=globalThis.prismaGlobal || prismaClientSngleton()

export default prisma

if(process.env.NODE_ENV !=='production'){
    globalThis.prismaGlobal=prisma
}