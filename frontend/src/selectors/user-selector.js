export const selectUserData = ({user}) => user.user

export const selectUserRoles = ({user}) => user.roles

export const selectDirectorOrgId = ({user}) => user.user?.organization?.organizationId

export const selectUsers = ({adminUser}) => adminUser.users

export const selectFormatUserLimits = ({adminUser}) => adminUser.formatUserLimits

export const selectUserLimits = ({adminUser}) => adminUser.userLimits