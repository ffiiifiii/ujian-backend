import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient

const createRent = async (request: Request, response: Response) => {
    try {
        const carId = Number(request.body.carId)
        const nameCustomer = (request.body.nameCustomer)
        const bookedDate = new Date(request.body.bookedDate).toISOString()
        const lama_sewa = Number(request.body.lama_sewa)

        const car = await prisma.car.findFirst({ where: { carId: carId } })
        if (!car) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: 'Data car not found'
                })
        }

        const total_bayar = car.harga_perhari * lama_sewa

        const newData = await prisma.rent.create({
            data: {
                carId: carId,
                nameCustomer: nameCustomer,
                bookDate: bookedDate,
                lama_sewa: lama_sewa,
                total_bayar: total_bayar
            }
        })
        return response.status(200).json({
            status: true,
            message: `rent has been created`,
            data: newData
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const readRent = async (request: Request, response: Response) => {
    try {
        const dataRent = await prisma.rent.findMany()
        return response.status(200).json({
            status: true,
            message: `rent has been loaded`,
            data: dataRent
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const updateRent = async (request: Request, response: Response) => {
    try {
        const rentId = request.params.rentId
        const carId = Number(request.body.carId)
        const nameCustomer = request.body.nameCustomer
        const bookDate = new Date(request.body.bookDate).toISOString()
        const lama_sewa = Number(request.body.lama_sewa)

        const findRent = await prisma.rent.findFirst({
            where: { rentId: Number(rentId) }
        })

        if (!findRent) {
            return response.status(400).json({
                status: false,
                message: `data rent not found`
            })
        }

        const car = await prisma.car.findFirst({ where: { carId: carId } })
        if (!car) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: 'Data car not found'
                })
        }

        const total_bayar = car.harga_perhari * lama_sewa
        
        const dataRent = await prisma.rent.update({
            where: { rentId: Number(rentId) },
            data: {
                carId: carId || findRent.carId,
                nameCustomer: nameCustomer || findRent.nameCustomer,
                bookDate: bookDate || findRent.bookDate,
                lama_sewa: lama_sewa || findRent.lama_sewa,
                total_bayar: total_bayar || findRent.total_bayar
            }
        })

        return response.status(200).json({
            status: true,
            message: `Data rent has been update`,
            data: dataRent
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const deleteRent = async (request: Request, response: Response) => {
    try {
        const rentId = request.params.rentId

        const findRent = await prisma.rent.findFirst({
            where: { rentId: Number(rentId) }
        })

        if (!findRent) {
            return response.status(400).json({
                status: false,
                message: `Data rent not found`
            })
        }

        const dataRent = await prisma.rent.delete({
            where: { rentId: Number(rentId) }
        })

        return response.status(200).json({
            status: true,
            message: `Data ren has been delete`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

export { createRent, readRent, updateRent, deleteRent }