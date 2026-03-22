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
        const serviceId = (process.env.EMAILJS_SERVICE_ID || '').trim();
        const templateId = (process.env.EMAILJS_TEMPLATE_ID || '').trim();
        const publicKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim();
        const privateKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();

        if (!serviceId || !templateId || !publicKey) {
            console.error('EmailJS Error: Missing configuration in .env');
            return false;
        }

        const payload = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            accessToken: privateKey,
            template_params: {
                to_name: candidateName,
                to_email: candidateEmail,
                candidate_name: candidateName, // fallback
                candidate_email: candidateEmail, // fallback
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
            console.log(`✓ Email successfully sent to ${candidateEmail}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`✗ EmailJS API Error (${response.status}):`, errorText);
            if (errorText.includes('restricted') || errorText.includes('security')) {
                console.error('IMPORTANT: You MUST enable "REST API access" in your EmailJS Dashboard');
                console.error('Go to: EmailJS Dashboard > Account > Security > Enable REST API access');
            }
            return false;
        }
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};
