const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const logger = require("../utils/logger");
const { SALT_PW, JWT_SECRET } = require("../config/env.config");
const { CustomError } = require("../middleware/errorHandler");


const register = async (req, res, next) => {
    try {
        console.log(SALT_PW)
        logger.info('Registering new user')
        const { name, email, password, role } = req?.body
        const hashedPassword = await bcrypt.hash(password, parseInt(SALT_PW))
        const user = new User({ name, email, password: hashedPassword, role })
        await user.save()
        res.status(201).json({ message: "User registered" })
    } catch (error) {
        logger.error(error)

        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !bcrypt.compare(password, user.password)) throw new CustomError("Invalid Credentials", 401)

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ message: 'Logged In', token })

    } catch (error) {
        console.error(error)
        next(error)
    }
}

module.exports = { register, login }