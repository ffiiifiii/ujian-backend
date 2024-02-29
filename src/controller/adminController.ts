import { PrismaClient } from "@prisma/client"
import md5 from "md5"
import { sign } from "jsonwebtoken"
import { Request, Response } from "express"
const prisma = new PrismaClient

/**asyncronus = fungsi yang berjalan secara paralel */
const createAdmin = async (request: Request, response: Response) => {
    try {
        /**read request body */
        const adminName = (request.body.adminName)
        const email = (request.body.email)
        const password = md5(request.body.password)

        /** memasukkan tabel admin menggunakan prisma*/
        const newData = await prisma.admin.create({
            data: {
                adminName: adminName,
                email: email,
                password: password
            }
        })
        return response.status(200).json({
            status: true,
            message: `admin has been created`,
            data: newData
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const readAdmin = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        const keyword = request.query.keyword?.toString() || "";
        const dataAdmin = await prisma.admin.findMany({
            /**pagination = membatasi jumlah data, harus tau page dan quantity*/
            take: qty,
            skip: (page - 1) * qty,
            /**searching */
            where: {
                OR: [
                    { adminName: { contains: keyword } },
                    {email: { contains: keyword}}
                ]
            }
        })

        return response.status(200).json({
            status: true,
            message: `admin has been loaded`,
            data: dataAdmin
        })
    } catch (error) {
        return response.status(200).json({
            status: false,
            message: error
        })
    }
}

const updateAdmin = async (request: Request, response: Response) => {
    try {
        const adminId = Number(request.params.adminId)
        const adminName = (request.body.adminName)
        const email = (request.body.email)
        const password = (request.body.password)

        const findAdmin = await prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        })

        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `data admin not found`
            })
        }

        const dataAdmin = await prisma.admin.update({
            where: { adminId: Number(adminId) },
            data: {
                adminName: adminName || findAdmin.adminName,
                email: email || findAdmin.email,
                password: password || findAdmin.password
            }
        })

        return response.status(200).json({
            status: true,
            message: `admin has been update`,
            data: dataAdmin
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const deleteAdmin = async (request: Request, response: Response) => {
    try {
        const adminId = request.params.adminId

        const findAdmin = await prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        })

        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `admin not found`
            })
        }

        const dataAdmin = await prisma.admin.delete({
            where: { adminId: Number(adminId) }
        })

        return response.status(200).json({
            status: true,
            message: `data has been delete`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body.password)
        const admin = await prisma.admin.findFirst(
            {
                where: { email: email, password: password }
            }
        )
        if (admin) {
            const payload = admin
            const secretkey = "fidifidi"
            const token = sign(payload, secretkey)
            return response.status(200).json({
                status: true,
                message: `login berhasil`,
                token: token
            })
        } else {
            return response.status(200).json({
                status: false,
                message: `login gagal`
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}
export { createAdmin, readAdmin, updateAdmin, deleteAdmin, login }