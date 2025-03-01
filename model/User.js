const mongoose = require('mongoose')
const { ROLES } = require('../utils/constants')


const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, enum: [ROLES.ADMIN, ROLES.VIEW_ONLY, ROLES.EDITOR], default: ROLES.VIEW_ONLY },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('User', userSchema)