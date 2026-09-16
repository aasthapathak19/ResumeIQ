"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
const ai_worker_1 = require("./ai.worker");
dotenv_1.default.config();
const startWorkerProcess = async () => {
    try {
        // Workers need DB connection to save results
        await (0, db_1.connectDB)();
        (0, ai_worker_1.startAiWorker)();
    }
    catch (error) {
        console.error('Failed to start worker process:', error);
        process.exit(1);
    }
};
startWorkerProcess();
