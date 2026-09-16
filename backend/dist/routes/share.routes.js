"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("../controllers/resume.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Unauthenticated routes for viewing shared resumes
router.get('/:token', rateLimiter_1.apiLimiter, resume_controller_1.getSharedResume);
router.get('/:token/file', rateLimiter_1.apiLimiter, resume_controller_1.getSharedResumeFile);
exports.default = router;
