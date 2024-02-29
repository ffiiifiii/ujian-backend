import express from "express"
import { createRent, deleteRent, readRent, updateRent } from "../controller/rentController"
import { readCar } from "../controller/carController"

const app = express()

app.use(express.json())

app.post(`/rent`, createRent)
app.get(`/rent`, readRent)
app.put(`/rent/:rentId`, updateRent)
app.delete(`/rent/:rentId`, deleteRent)

export default app