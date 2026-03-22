import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends a certificate notification email using the EmailJS REST API
 * @param {string} candidateEmail 
 * @param {string} candidateName 
 * @param {string} certificateId 
 * @param {string} verificationLink 
 * @returns {Promise<boolean>}
 */
export const sendCertificateEmail = async (candidateEmail, candidateName, certificateId, verificationLink) => {
    try {
        const payload = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY, // Private key for backend-side sending
            template_params: {
                to_name: candidateName,
                to_email: candidateEmail,
                certificate_id: certificateId,
                verification_link: verificationLink,
            },
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Email successfully sent to ${candidateEmail} via EmailJS`);
            return true;
        } else {
            const errorText = await response.text();
            console.error('EmailJS API Error:', errorText);
            return false;
        }
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};
