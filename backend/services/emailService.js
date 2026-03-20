import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the transporter using Ethereal email or a real service
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendCertificateEmail = async (candidateEmail, candidateName, certificateId, verificationLink) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Admin" <admin@certicreate.com>',
            to: candidateEmail,
            subject: 'Your Internship Certificate is Ready!',
            html: `
                <h3>Congratulations, ${candidateName}!</h3>
                <p>Your internship certificate has been successfully generated.</p>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p>You can verify and download your certificate using the link below:</p>
                <a href="${verificationLink}">Verify Certificate</a>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};
