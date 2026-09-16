"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("../controllers/resume.controller");
const auth_1 = require("../middleware/auth");
const storage_service_1 = require("../services/storage.service");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const resume_schema_1 = require("../schemas/resume.schema");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes in this file
router.use(auth_1.requireAuth);
router.post('/upload', rateLimiter_1.uploadLimiter, storage_service_1.upload.single('resumeFile'), (0, validate_1.validateRequest)(resume_schema_1.uploadSchema), resume_controller_1.uploadResume);
router.get('/', resume_controller_1.getAllResumes);
router.get('/:id', resume_controller_1.getResumeById);
router.get('/:id/file', resume_controller_1.getResumeFile);
router.delete('/:id', resume_controller_1.deleteResume);
exports.default = router;
