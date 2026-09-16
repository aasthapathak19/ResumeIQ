import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadDir, 'resumes', req.user?.id || 'anonymous');
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/pdf' && ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files with .pdf extension are allowed'));
    }
  }
});

export interface IStorageService {
  getFileStream(filePath: string): fs.ReadStream;
  deleteFile(filePath: string): Promise<void>;
  getFileBuffer(filePath: string): Promise<Buffer>;
}

export const LocalStorageService: IStorageService = {
  getFileStream: (filePath: string) => {
    if (!fs.existsSync(filePath)) throw new Error('File not found in local storage');
    return fs.createReadStream(filePath);
  },
  deleteFile: async (filePath: string) => {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  },
  getFileBuffer: async (filePath: string) => {
    return fs.promises.readFile(filePath);
  }
};

// Export the default implementation
export const StorageService = LocalStorageService;
