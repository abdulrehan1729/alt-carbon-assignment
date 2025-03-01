const ROLES = Object.freeze({
    ADMIN: 'admin',
    VIEW_ONLY: 'view_only',
    EDITOR: 'editor'
})
const PROJECT_STATUS = ['active', 'completed', 'pending'];


module.exports = { ROLES, PROJECT_STATUS }