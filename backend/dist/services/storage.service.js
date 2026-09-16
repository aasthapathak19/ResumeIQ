"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.LocalStorageService = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path_1.default.join(uploadDir, 'resumes', req.user?.id || 'anonymous');
        fs_1.default.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (file.mimetype === 'application/pdf' && ext === '.pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files with .pdf extension are allowed'));
        }
    }
});
exports.LocalStorageService = {
    getFileStream: (filePath) => {
        if (!fs_1.default.existsSync(filePath))
            throw new Error('File not found in local storage');
        return fs_1.default.createReadStream(filePath);
    },
    deleteFile: async (filePath) => {
        if (fs_1.default.existsSync(filePath)) {
            await fs_1.default.promises.unlink(filePath);
        }
    },
    getFileBuffer: async (filePath) => {
        return fs_1.default.promises.readFile(filePath);
    }
};
// Export the default implementation
exports.StorageService = exports.LocalStorageService;
