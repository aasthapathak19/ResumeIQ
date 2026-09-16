"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply auth middleware to all routes in this file
router.use(auth_1.requireAuth);
router.get('/analysis/:resumeId', ai_controller_1.getAnalysis);
exports.default = router;
