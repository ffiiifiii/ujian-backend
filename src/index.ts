import express, { Request, Response } from "express";
import routeAdmin from "./route/adminRouter";
import routeCar from "./route/carRouter";
import routeRent from "./route/rentRouter";

const app = express()

const port = 8000

app.use(express.json())

app.use(routeAdmin)
app.use(routeCar)
app.use(routeRent)

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})