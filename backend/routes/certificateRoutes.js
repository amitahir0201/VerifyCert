import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import {
    uploadExcel,
    verifyCertificate,
    downloadCertificate,
    getAllCertificates,
    deleteCertificate,
} from '../controllers/certificateController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `excel_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel/CSV files are allowed'));
        }
    },
});

const router = express.Router();

// Public routes
router.get('/verify/:certificateId', verifyCertificate);
router.get('/download/:certificateId', downloadCertificate);

// Admin-protected routes
router.post('/upload', protect, upload.single('file'), uploadExcel);
router.get('/', protect, getAllCertificates);
router.delete('/:certificateId', protect, deleteCertificate);

export default router;