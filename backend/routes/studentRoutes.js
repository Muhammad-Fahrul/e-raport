import express from 'express';
const router = express.Router();

import {
  createNewStudent,
  deleteStudentById,
  getStudentsByMentorId,
} from '../controllers/studentController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { permit } from '../middleware/roleVerification.js';

router.use(verifyJWT);
router.use(permit('mentor'));
router.route('/').get(getStudentsByMentorId).post(createNewStudent);

router.use('/:username', permit('mentor'));
router.route('/:username').delete(deleteStudentById);

export default router;
