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

            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
            
            doc.fontSize(40).fillColor('#333').text('Certificate of Completion', { align: 'center' });
            doc.moveDown();
            
            doc.fontSize(20).text('This is to certify that', { align: 'center' });
            doc.moveDown();

            doc.fontSize(30).fillColor('#00D8FF').text(certificateData.studentName, { align: 'center' });
            doc.moveDown();

            doc.fontSize(20).fillColor('#333').text(`has successfully completed the internship program in`, { align: 'center' });
            doc.moveDown();

            doc.fontSize(25).fillColor('#00D8FF').text(certificateData.internshipDomain, { align: 'center' });
            doc.moveDown();

            doc.fontSize(15).fillColor('#333').text(`From: ${new Date(certificateData.startDate).toDateString()} To: ${new Date(certificateData.endDate).toDateString()}`, { align: 'center' });
            doc.moveDown();

            doc.fontSize(15).fillColor('#333').text(`Issue Date: ${new Date(certificateData.issueDate).toDateString()}`, { align: 'right' });
            doc.text(`Certificate ID: ${certificateData.certificateId}`, { align: 'left' });

            const qrCodeDataUrl = await QRCode.toDataURL(verificationLink);
            const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
            doc.image(qrCodeBuffer, 50, doc.page.height - 150, { width: 100 });
            
            doc.text('Scan to Verify', 50, doc.page.height - 40);

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
