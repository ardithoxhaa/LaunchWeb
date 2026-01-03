import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import {
  loginSchema,
  registerSchema,
  refreshSchema,
  updateProfileSchema,
  changePasswordSchema,
  logoutAllSchema,
  bootstrapAdminSchema,
} from './auth.validation.js';
import {
  login,
  refresh,
  register,
  logout,
  me,
  updateProfile,
  changePassword,
  logoutAll,
  bootstrapAdmin,
} from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/bootstrap-admin', validate(bootstrapAdminSchema), asyncHandler(bootstrapAdmin));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', validate(refreshSchema), asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(me));
router.put('/profile', requireAuth, validate(updateProfileSchema), asyncHandler(updateProfile));
router.put('/password', requireAuth, validate(changePasswordSchema), asyncHandler(changePassword));
router.post('/logout-all', requireAuth, validate(logoutAllSchema), asyncHandler(logoutAll));

export default router;
