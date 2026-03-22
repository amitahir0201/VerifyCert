import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    const serviceId = (process.env.EMAILJS_SERVICE_ID || '').trim();
    const templateId = (process.env.EMAILJS_TEMPLATE_ID || '').trim();
    const publicKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim();
    const privateKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();

    console.log('Testing EmailJS with:');
    console.log('- Service ID:', serviceId);
    console.log('- Template ID:', templateId);
    console.log('- Public Key:', publicKey);
    console.log('- Private Key (exists):', !!privateKey);

    const frontendURL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

    const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
            to_name: 'Test User',
            to_email: 'amitahir0201@gmail.com', // Using user's email for test
            certificate_id: 'TEST-123',
            verification_link: `${frontendURL}/certificate/TEST-123`,
        },
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const status = response.status;
        const text = await response.text();

        if (response.ok) {
            console.log('SUCCESS: Email sent!', status, text);
        } else {
            console.error('FAILURE: EmailJS rejected the request.', status, text);
        }
    } catch (err) {
        console.error('ERROR: Network or Fetch error:', err);
    }
};

testEmail();
