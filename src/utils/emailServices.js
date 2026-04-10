import nodemailer from 'nodemailer';

// Configure transporter (move this to a separate config file ideally)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendBookingConfirmation = async (userEmail, teacherName, subject) => {
    try {
        const mailOptions = {
            from: `"Tutor Platform" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Booking Confirmation',
            html: `
                <h2>Booking Confirmed!</h2>
                <p>Your booking with ${teacherName} for ${subject} has been confirmed.</p>
                <p>Thank you for using our platform!</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending booking confirmation:', error);
    }
};

export const sendReminder = async (userEmail, sessionTime) => {
    try {
        const mailOptions = {
            from: `"Tutor Platform" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Upcoming Session Reminder',
            html: `
                <h2>Session Reminder</h2>
                <p>This is a reminder that your session is scheduled for:</p>
                <p><strong>${new Date(sessionTime).toLocaleString()}</strong></p>
                <p>Please log in a few minutes before your session starts.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending reminder:', error);
    }
};

// Optional: Add a function to send password reset emails
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
    try {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Tutor Platform" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};