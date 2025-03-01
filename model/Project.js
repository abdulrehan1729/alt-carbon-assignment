const mongoose = require('mongoose')
const { PROJECT_STATUS } = require('../utils/constants')

const projectSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number], required: true },
    },
    boundary: {
        type: { type: String, enum: ['Polygon'] },
        coordinates: { type: [[[Number]]], required: true },
    },
    area_hectares: { type: Number, required: true },
    start_date: { type: Date, required: true },
    project_type: { type: String, enum: ['reforestation', 'soil_carbon', 'mangrove'], required: true },
    metrics: {
        carbon_removal_rate: Number,
        total_carbon_removed: Number,
        soil_organic_carbon: Number,
        biodiversity_index: Number,
    },
    verification: {
        last_verified: Date,
        verification_method: { type: String, enum: ['satellite', 'ground', 'drone'] },
        confidence_score: Number,
    },
    status: { type: String, enum: PROJECT_STATUS, default: 'pending' }
}, { timeStamps: true })

projectSchema.index({ location: '2dsphere' })
module.exports = mongoose.model("Project", projectSchema)