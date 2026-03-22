import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Certificate from '../models/Certificate.js';
import { generateCertificateId } from '../utils/generateCertificateId.js';
import { streamPDFCertificate } from '../services/certificateService.js';
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
        console.log(`Processing ${rows.length} rows from Excel...`);

        for (const row of rows) {
            console.log('Original Row Data:', JSON.stringify(row));
            
            // Flexible column mapping (case-insensitive, ignores spaces)
            const findKey = (keywords) => {
                const keys = Object.keys(row);
                return keys.find(k => {
                    const normalized = k.toLowerCase().replace(/\s/g, '');
                    return keywords.some(kw => normalized.includes(kw));
                });
            };

            const studentNameKey = findKey(['studentname', 'name', 'candidate']);
            const emailKey = findKey(['email', 'mail']);
            const domainKey = findKey(['domain', 'internship', 'track']);
            const startDateKey = findKey(['startdate', 'start']);
            const endDateKey = findKey(['enddate', 'end']);

            const certificateId = generateCertificateId();
            const issueDate = new Date();

            const certData = {
                certificateId,
                studentName: row[studentNameKey] || 'Student',
                email: row[emailKey],
                internshipDomain: row[domainKey] || 'Internship',
                startDate: new Date(row[startDateKey] || new Date()),
                endDate: new Date(row[endDateKey] || new Date()),
                issueDate,
            };

            console.log('Mapped Certificate Data:', JSON.stringify(certData));

            if (!certData.email) {
                console.warn(`Skipping email for ${certData.studentName} - No email found in columns: ${Object.keys(row).join(', ')}`);
            }

            const frontendBase = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
            const verificationLink = `${frontendBase}/certificate/${certificateId}`;

            // Save to MongoDB
            const certificate = new Certificate(certData);
            await certificate.save();

            // Send email (non-blocking)
            if (certData.email) {
                sendCertificateEmail(
                    certData.email,
                    certData.studentName,
                    certificateId,
                    verificationLink
                ).then(success => {
                    if (success) console.log(`Email process completed for ${certData.email}`);
                    else console.error(`Email process failed for ${certData.email}`);
                }).catch(err => {
                    console.error(`Unexpected error sending email to ${certData.email}:`, err);
                });
            }

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

        const frontendBase = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        const verificationLink = `${frontendBase}/certificate/${certificate.certificateId}`;
        
        await streamPDFCertificate(certificate, verificationLink, res);
    } catch (error) {
        console.error('Download error:', error);
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
        // No more physical PDF files to delete (generated on the fly)
        // No more physical PDF files to delete (generated on the fly)
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};