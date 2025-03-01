const { CustomError } = require("../middleware/errorHandler");
const Project = require("../model/Project");
const logger = require("../utils/logger");

const createProject = async (req, res, next) => {
    try {
        const project = new Project(req.body)
        await project.save()
        logger.info(`Project created: ${project.name}`)
        res.status(201).json({ message: 'Project created', data: project })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getProjects = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, project_type } = req.query
        const filter = {}
        if (status) filter.status = status;
        if (project_type) filter.project_type = project_type

        const projects = await Project.find(filter)
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .exec();

        logger.info('Projects fetched')
        const total = await Project.countDocuments(filter);

        res.status(200).json({ message: "Projects fetched successfully", data: projects, total, page })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) throw new CustomError('Project not found', 404)

        logger.info(`Project Retrieved: ${project.name}`)
        res.status(200).json({ message: "Project fetched successfully", data: project })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!project) throw new CustomError('Project not found', 404)

        logger.info(`Project updated: ${project.name}`)
        res.status(200).json({ message: "Project updated successfully", data: project })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const deletePorject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id)
        if (!project) throw new CustomError('Project not found', 404)

        logger.info(`Project deleted: ${project.name}`)
        res.status(200).json({ message: "Project deleted successfully", data: project })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getProjectsNearBy = async (req, res, next) => {
    try {
        const { lng, lat, radius } = req.query
        console.log('project nearby')
        const projects = await Project.find({
            location: {
                $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1] }
            }
        })
        logger.info(`Projects retrieved within radius: ${radius} km`);

        res.status(200).json({ message: `Projects fetched within the radius: ${radius} km`, data: projects })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getProjectsWithin = async (req, res, next) => {
    try {
        const { coordinates } = req.body
        if (!coordinates) throw new CustomError('Missing polygon coordinates', 400)
        const projects = await Project.find({
            boundary: {
                $geoWithin: {
                    $geometry: {
                        type: 'Polygon',
                        coordinates,
                    },
                }
            }
        })
        logger.info(`Projects retrieved within polygon coordinates: ${coordinates} `);

        res.status(200).json({ message: `Projects fetched within polygon coordinates: ${coordinates} `, data: projects })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getProjectRegionalImpact = async (req, res, next) => {
    try {
        const projects = await Project.aggregate([{
            $group: {
                _id: 'project_type',
                total_carbon_removed: { $sum: '$metrics.total_carbon_removed' },
                average_biodiversity: { $avg: '$metrics.biodiversity_index' }
            }
        }])

        logger.info(`Projects Regional Impact nalysis`);

        res.status(200).json({ message: `Regional Impact calculated successfully`, data: projects })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const getAnalyticsForecast = async (req, res, next) => {
    try {
        const forecast = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    projected_carbon_removal: { $sum: { $multiply: ['$metrics.carbon_removal_rate', 10] } }
                }
            }
        ])
        logger.info(`Carbon Impact Forecast`);

        res.status(200).json({ message: `Carbon Impact Forecast generated successfully `, data: forecast })

    } catch (error) {
        logger.error(error)
        next(error)
    }
}

const generateCustomReports = async (req, res, next) => {
    try {
        const { status, project_type } = req.query
        const filter = {}
        if (status) filter.status = status;
        if (project_type) filter.project_type = project_type

        const report = await Project.find(filter).select('-_id name metrics status')
        res.status(200).json({ message: 'Report generated successfully', data: report })

    } catch (error) {
        logger.error(error)
        next(error)

    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deletePorject,
    getProjectsNearBy,
    getProjectsWithin,
    getProjectRegionalImpact,
    getAnalyticsForecast,
    generateCustomReports
}