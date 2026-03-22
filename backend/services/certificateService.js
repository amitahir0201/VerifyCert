import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDFCertificate = async (certificateData, verificationLink) => {
    return new Promise(async (resolve, reject) => {
        try {
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const fileName = `${certificateData.certificateId}.pdf`;
            const filePath = path.join(uploadDir, fileName);
            const relativePath = `/uploads/${fileName}`;

            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Background Fill
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

            // Draw Decorative Borders
            // Thick Outer Border (Dark Blue)
            doc.lineWidth(20);
            doc.rect(0, 0, doc.page.width, doc.page.height).stroke('#0A3D62');
            
            // Thin Inner Border (Gold)
            doc.lineWidth(2);
            doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#D4AF37');

            const centerX = doc.page.width / 2;

            // Certificate Header
            doc.moveDown(2);
            doc.fontSize(45)
               .font('Helvetica-Bold')
               .fillColor('#0A3D62')
               .text('CERTIFICATE', { align: 'center' });
            
            doc.fontSize(20)
               .font('Helvetica')
               .fillColor('#333')
               .text('OF COMPLETION', { align: 'center', characterSpacing: 2 });

            doc.moveDown(1);

            // Statement
            doc.fontSize(16)
               .font('Helvetica')
               .fillColor('#555')
               .text('This is to certify that', { align: 'center' });

            doc.moveDown(1);

            // Student Name
            doc.fontSize(36)
               .font('Helvetica-Bold')
               .fillColor('#D4AF37')
               .text(certificateData.studentName.toUpperCase(), { align: 'center' });

            // Decorative Line under Name
            doc.lineWidth(1);
            doc.moveTo(centerX - 150, doc.y + 5)
               .lineTo(centerX + 150, doc.y + 5)
               .stroke('#D4AF37');

            doc.moveDown(1);

            // Domain Text
            doc.fontSize(16)
               .font('Helvetica')
               .fillColor('#555')
               .text('has successfully completed the internship program in', { align: 'center' });

            doc.moveDown(1);

            // Internship Domain
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .fillColor('#0A3D62')
               .text(certificateData.internshipDomain, { align: 'center' });

            doc.moveDown(1);

            // Dates
            doc.fontSize(14)
               .font('Helvetica')
               .fillColor('#555')
               .text(`From: ${new Date(certificateData.startDate).toLocaleDateString()}  To: ${new Date(certificateData.endDate).toLocaleDateString()}`, { align: 'center' });

            doc.moveDown(1);

            // Footer Section (Signatures and QR)
            const footerY = doc.page.height - 200;

            // QR Code (Left)
            const qrCodeDataUrl = await QRCode.toDataURL(verificationLink);
            const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
            doc.image(qrCodeBuffer, 80, footerY, { width: 90 });
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor('#555')
               .text('Scan to Verify', 85, footerY + 95);

            // Signature (Right)
            doc.lineWidth(1);
            doc.moveTo(doc.page.width - 250, footerY + 80)
               .lineTo(doc.page.width - 80, footerY + 80)
               .stroke('#333');
            
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .fillColor('#0A3D62')
               .text('Authorized Signatory', doc.page.width - 250, footerY + 90, { width: 170, align: 'center' });

            // Certificate Info (Bottom Center)
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor('#777')
               .text(`Certificate ID: ${certificateData.certificateId}`, 0, doc.page.height - 80, { align: 'center' });
            
            doc.text(`Issue Date: ${new Date(certificateData.issueDate).toLocaleDateString()}`, { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve(relativePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};
