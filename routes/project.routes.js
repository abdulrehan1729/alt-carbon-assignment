const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deletePorject,
    getProjectsNearBy,
    getProjectsWithin,
    getProjectRegionalImpact,
    getAnalyticsForecast,
    generateCustomReports } = require('../controller/project.controller')
const { authenticateUser, authorizeRoles } = require('../middleware/auth')
const { ProjectValidator, validateUpdateProject, validateDeleteProject, validateProjectId } = require('../middleware/validation')
const { ROLES } = require('../utils/constants')

const projectRoutes = require('express').Router()

projectRoutes.get('/', authenticateUser, ProjectValidator.getProjects, getProjects)
projectRoutes.post('/', authenticateUser, ProjectValidator.createProject, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), createProject)
projectRoutes.get('/nearby', authenticateUser, ProjectValidator.getProjectsNearBy, getProjectsNearBy)
projectRoutes.post('/within', authenticateUser, ProjectValidator.getProjectsWithin, getProjectsWithin)
projectRoutes.get('/impact', authenticateUser, getProjectRegionalImpact)
projectRoutes.get('/analytics/forecast', authenticateUser, getAnalyticsForecast)
projectRoutes.get('/analytics/report', authenticateUser, authorizeRoles(ROLES.ADMIN), generateCustomReports)
projectRoutes.put('/:id', authenticateUser, validateUpdateProject, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), updateProject)
projectRoutes.delete(':/id', authenticateUser, validateDeleteProject, authorizeRoles(ROLES.ADMIN), deletePorject)
projectRoutes.get('/:id', authenticateUser, validateProjectId, getProjectById)


module.exports = projectRoutes