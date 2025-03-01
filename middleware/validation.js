const Joi = require('joi');
const { PROJECT_STATUS } = require('../utils/constants');

class AuthValidator {
    static register(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('user', 'admin').optional()
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    }

    static login(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    }
}


class ProjectValidator {
    static createProject(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            description: Joi.string().optional(),
            location: Joi.object({
                type: Joi.string().valid('Point').required(),
                coordinates: Joi.array().items(Joi.number()).length(2).required()
            }).optional(),
            boundary: Joi.object({
                type: Joi.string().valid('Polygon').required(),
                coordinates: Joi.array().items(
                    Joi.array().items(
                        Joi.array().items(Joi.number()).min(2)
                    )
                ).required()
            }).optional(),
            area_hectares: Joi.number().positive().required(),
            start_date: Joi.date().iso().required(),
            project_type: Joi.string().valid('reforestation', 'soil_carbon', 'mangrove').required(),
            metrics: Joi.object({
                carbon_removal_rate: Joi.number().optional(),
                total_carbon_removed: Joi.number().optional(),
                soil_organic_carbon: Joi.number().optional(),
                biodiversity_index: Joi.number().optional(),
            }).optional(),
            verification: Joi.object({
                last_verified: Joi.date().iso().optional(),
                verification_method: Joi.string().valid('satellite', 'ground', 'drone').optional(),
                confidence_score: Joi.number().min(0).max(1).optional(),
            }).optional(),
            status: Joi.string().valid(...PROJECT_STATUS).default('pending')
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    }

    static getProjects(req, res, next) {
        const schema = Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            status: Joi.string().valid(...PROJECT_STATUS).optional(),
            project_type: Joi.string().valid('reforestation', 'soil_carbon', 'mangrove').optional()
        });

        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    }


    static getProjectsNearBy(req, res, next) {
        console.log('validation begins...')
        const schema = Joi.object({
            lng: Joi.number().required(),
            lat: Joi.number().required(),
            radius: Joi.number().positive().required()
        });

        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        console.log('validation ends...')
        next();
    }

    static getProjectsWithin(req, res, next) {
        const schema = Joi.object({
            coordinates: Joi.array().items(
                Joi.array().items(
                    Joi.array().items(Joi.number()).min(2)
                )
            ).required()
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    }
}

function validateProjectId(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().hex().length(24).required()
    });

    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(err => err.message) });
    }
    next();
}


function validateUpdateProject(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        description: Joi.string().optional(),
        location: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required()
        }).optional(),
        boundary: Joi.object({
            type: Joi.string().valid('Polygon').required(),
            coordinates: Joi.array().items(
                Joi.array().items(
                    Joi.array().items(Joi.number()).min(2)
                )
            ).required()
        }).optional(),
        area_hectares: Joi.number().positive().optional(),
        start_date: Joi.date().iso().optional(),
        project_type: Joi.string().valid('reforestation', 'soil_carbon', 'mangrove').optional(),
        metrics: Joi.object({
            carbon_removal_rate: Joi.number().optional(),
            total_carbon_removed: Joi.number().optional(),
            soil_organic_carbon: Joi.number().optional(),
            biodiversity_index: Joi.number().optional(),
        }).optional(),
        verification: Joi.object({
            last_verified: Joi.date().iso().optional(),
            verification_method: Joi.string().valid('satellite', 'ground', 'drone').optional(),
            confidence_score: Joi.number().min(0).max(1).optional(),
        }).optional(),
        status: Joi.string().valid(...PROJECT_STATUS).optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(err => err.message) });
    }
    next();
}

function validateDeleteProject(req, res, next) {
    validateProjectId(req, res, next);
}


module.exports = { AuthValidator, ProjectValidator, validateProjectId, validateDeleteProject, validateUpdateProject };