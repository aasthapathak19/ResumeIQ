"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSchema = void 0;
const zod_1 = require("zod");
exports.uploadSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().optional(),
        jobTitle: zod_1.z.string().optional(),
        jobDescription: zod_1.z.string().optional(),
    }),
});
