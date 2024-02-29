import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient

const createCar = async (request: Request, response: Response) => {
    try {
        const nopol = (request.body.nopol)
        const merkCar = (request.body.merkCar)
        const harga_perhari = Number(request.body.harga_perhari)

        const newData = await prisma.car.create({
            data: {
                nopol: nopol,
                merkCar: merkCar,
                harga_perhari
            }
        })
        return response.status(200).json({
            status: true,
            message: `car has been created`,
            data: newData
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const readCar = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 10;
        const keyword = request.query.keyword?.toString() || "";
        const dataCar = await prisma.car.findMany({
            /**pagination */
            take: qty,
            skip: (page - 1) * qty,
            /**searching */
            where: {
                OR: [
                    { nopol: { contains: keyword } },
                    { merkCar: { contains: keyword } }
                ]
            }
        })
        return response.status(200).json({
            status: true,
            messgae: `car has been loaded`,
            data: dataCar
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const updateCar = async (request: Request, response: Response) => {
    try {
        const carId = (request.params.carId);
        const nopol = (request.body.nopol);
        const merkCar = (request.body.merkCar);
        const harga_perhari = Number(request.body.harga_perhari);

        const findCar = await prisma.car.findFirst({
            where: { carId: Number(carId) }
        })

        if (!findCar) {
            return response.status(400).json({
                status: true,
                message: `Data Car not Found`
            })
        }

        const dataCar = await prisma.car.update({
            where: { carId: Number(carId) },
            data: {
                nopol: nopol || findCar.nopol,
                merkCar: merkCar || findCar.merkCar,
                harga_perhari: harga_perhari || findCar.harga_perhari
            }
        })

        return response.status(200).json({
            status: false,
            message: `data car has been update`,
            data: dataCar
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const deleteCar = async (request: Request, response: Response) => {
    try {
        const carId = (request.params.carId)

        const findCar = await prisma.car.findFirst({
            where: { carId: Number(carId) }
        })

        if (!findCar) {
            return response.status(400).json({
                status: false,
                message: `data car not found`
            })
        }

        const dataCar = await prisma.car.delete({
            where: { carId: Number(carId) }
        })

        return response.status(200).json({
            status: true,
            message: `data car has been delete`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

export { createCar, readCar, updateCar, deleteCar }