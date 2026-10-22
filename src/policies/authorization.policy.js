import appError from '../utils/appError.utils.js';

const PERMISSIONS = Object.freeze({
  STUDENTS_READ: 'students:read',
  STUDENTS_CREATE: 'students:create',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',
  STUDENTS_ACCESS_SENSITIVE_DATA: 'students:access-sensitive-data',
  USERS_RESET_PASSWORD: 'users:reset-password',
});

const ROLE_PERMISSIONS = Object.freeze({
  ADMIN: [
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
    PERMISSIONS.STUDENTS_ACCESS_SENSITIVE_DATA,
    PERMISSIONS.USERS_RESET_PASSWORD,
  ],
  KEPALA_SEKOLAH: [
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
  ],
  GURU: [
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
  ],
  STAF: [
    PERMISSIONS.STUDENTS_READ,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
  ],
});

const hasPermission = (actor, permission) =>
  Object.hasOwn(ROLE_PERMISSIONS, actor?.role) &&
  ROLE_PERMISSIONS[actor.role].includes(permission);

const requirePermission = (actor, permission) => {
  if (!hasPermission(actor, permission)) {
    throw new appError(
      403,
      'You do not have permission to perform this action'
    );
  }
};

export { PERMISSIONS, hasPermission, requirePermission };
