import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Certificate from '../models/Certificate.js';
import { generateCertificateId } from '../utils/generateCertificateId.js';
import { generatePDFCertificate } from '../services/certificateService.js';
import { sendCertificateEmail } from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/certificates/upload
export const uploadExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        const results = [];

        for (const row of rows) {
            const certificateId = generateCertificateId();
            const issueDate = new Date();

            const certData = {
                certificateId,
                studentName: row['Student Name'] || row['studentName'],
                email: row['Email'] || row['email'],
                internshipDomain: row['Domain'] || row['internshipDomain'],
                startDate: new Date(row['Start Date'] || row['startDate']),
                endDate: new Date(row['End Date'] || row['endDate']),
                issueDate,
            };

            const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
            const verificationLink = `${frontendBase}/certificate/${certificateId}`;

            // Generate PDF
            const pdfPath = await generatePDFCertificate(certData, verificationLink);
            certData.certificateURL = pdfPath;

            // Save to MongoDB
            const certificate = new Certificate(certData);
            await certificate.save();

            // Send email (non-blocking - log errors but don't fail request)
            sendCertificateEmail(
                certData.email,
                certData.studentName,
                certificateId,
                verificationLink
            ).catch(console.error);

            results.push({ studentName: certData.studentName, certificateId });
        }

        // Remove uploaded Excel file after processing
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: `${results.length} certificates generated successfully`,
            certificates: results,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};

// GET /api/certificates/:certificateId  - verify
export const verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/certificates/download/:certificateId  - download PDF
export const downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        const filePath = path.join(__dirname, '..', certificate.certificateURL);
        if (!fs.existsSync(filePath)) {
            const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
            const verificationLink = `${frontendBase}/certificate/${certificate.certificateId}`;
            
            // Regenerate the PDF if it's missing
            await generatePDFCertificate(certificate, verificationLink);
            
            // Check again after regeneration
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'PDF file could not be generated' });
            }
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateId}.pdf"`);
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/certificates  - list all (admin only)
export const getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({}).sort({ issueDate: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/certificates/:certificateId  - delete (admin only)
export const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndDelete({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // Optionally delete the PDF file too
        const filePath = path.join(__dirname, '..', certificate.certificateURL);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};