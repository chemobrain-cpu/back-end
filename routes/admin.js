const express = require("express")
const router = express.Router()
const { verifyAdmin} = require("../utils/utils")
const { updateDeposit, fetchTransfers, updateTransfers } = require("../controller/admin")

let login = require("../controller/admin").login
let signup = require("../controller/admin").signup
let fetchUsers = require("../controller/admin").fetchUsers
let updateUser = require("../controller/admin").updateUser
let deleteUser = require("../controller/admin").deleteUser
let fetchDeposits = require("../controller/admin").fetchDeposits
let sendEmail = require("../controller/admin").sendEmail


//auth route
router.post("/adminlogin",login)
router.post('/adminsignup',signup)
//user routes
router.get('/users',verifyAdmin,fetchUsers)
router.patch('/users',verifyAdmin,updateUser)
router.delete('/users/:id',verifyAdmin,deleteUser)

//deposit routes
router.get('/deposits',verifyAdmin,fetchDeposits)
router.patch('/deposits/:id',verifyAdmin,updateDeposit)

//transfers routes
router.get('/transfers',verifyAdmin,fetchTransfers)
router.patch('/transfers/:id',verifyAdmin,updateTransfers)
router.post('/sendemail',verifyAdmin,sendEmail)


exports.router = router