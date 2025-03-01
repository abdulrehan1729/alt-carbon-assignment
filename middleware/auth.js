const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { CustomError } = require('./errorHandler')
const envConfig = require('../config/env.config')

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')
    try {
        if (!token) throw new CustomError("Access Denied", 401)

        const verified = jwt.verify(token.replace('Bearer ', ''), envConfig.JWT_SECRET)
        req.user = verified
        next()

    } catch (error) {
        next(error)
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                throw new CustomError('Unauthorized Access', 403)
            }
            next()
        }
        catch (error) {
            next(error)
        }
    }

}
module.exports = { authenticateUser, authorizeRoles }