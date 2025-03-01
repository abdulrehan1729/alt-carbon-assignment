const { register, login } = require('../controller/auth.controller')
const { AuthValidator } = require('../middleware/validation')

const authRoutes = require('express').Router()

authRoutes.post('/register', AuthValidator.register, register)
authRoutes.post('/login', AuthValidator.login, login)

module.exports = authRoutes