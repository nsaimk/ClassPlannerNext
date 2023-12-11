const nodemailer = require('nodemailer');
const { pool } = require('./dbConfig');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'thisteamcyf@hotmail.com',
        pass: process.env.REMINDER_EMAIL_PASSWORD
    },
});

const getUserData = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM person WHERE id = $1', [userId]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const getSessionData = async (sessionId) => {
    try {
        const result = await pool.query('SELECT session.*, lesson_content.* FROM session JOIN lesson_content ON session.lesson_content_id = lesson_content.id WHERE session.id = $1', [sessionId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};


const reminderEmail = async (userId, sessionId) => {
    try {
        const userData = await getUserData(userId);

        const sessionData = await getSessionData(sessionId); 

        // convert date to the format ex: "Tue Dec 05 2023"
        const formattedDate = new Date(sessionData.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });

        const formattedStartTime = new Date(sessionData.time_start).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/London'
        });

        const formattedEndTime = new Date(sessionData.time_end).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/London'
        });

        const emailSubject = 'Class Reminder';
        const emailText = `Hi ${userData.slack_firstname}, this is a reminder for your upcoming class.`;
        const emailHTML = `
      <div style="text-align: center;">
        <img src="https://codeyourfuture.io/wp-content/uploads/2019/03/cyf_brand.png" alt="CodeYourFuture Logo" style="max-width: 100%;" />
      </div>
      <p>Hi ${userData.slack_firstname},</p>
      <p>I hope this email finds you well. I wanted to confirm that we've received your registration for the upcoming CodeYourFuture class scheduled for <b>${formattedDate}</b>.</p>
      <p>We're thrilled to have you on board!</p>
      <h2>Class Details:</h2>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
      <p><strong>Class Leader:</strong> Add session.who_leading to the session table </p>
      <p><strong>Module and Week:</strong> ${sessionData.module} - ${sessionData.week_no}</p>
      <p><strong>Content Link:</strong> <a href="${sessionData.syllabus_link}">${sessionData.syllabus_link}</a></p>
      <p>Your commitment to participating in our classes is greatly appreciated, and we look forward to an engaging and enriching learning experience.</p>
      <p>If you have any questions or if there are any changes to your availability, please don't hesitate to reach out. Thank you for being a part of CodeYourFuture!</p>
      <p>Best regards,</p>
      <p>CYF Team.</p>
      <div style="text-align: center;">
        <a href="https://classplanner.vercel.app">Click here for more information</a>
      </div>
    `;

        await transporter.sendMail({
            from: 'thisteamcyf@hotmail.com',
            to: userData.slack_email,
            subject: emailSubject,
            text: emailText,
            html: emailHTML,
        }); 

        console.log(`Reminder email sent to ${userData.slack_email} address successfully.`);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

module.exports = reminderEmail