import  express  from "express"
import { verifyAdmin } from "../middleware/verifyAdmin"
import { createAdmin, deleteAdmin, readAdmin, updateAdmin, login } from "../controller/adminController"

const app = express()

/**allow to read a json from body */
app.use(express.json())
app.post(`/admin`, verifyAdmin, createAdmin)
app.get(`/admin`,   readAdmin)
app.put(`/admin/:adminId`, verifyAdmin, updateAdmin)
app.delete(`/admin/:adminId`, verifyAdmin, deleteAdmin)
app.post(`/admin/login`, login)

export default app