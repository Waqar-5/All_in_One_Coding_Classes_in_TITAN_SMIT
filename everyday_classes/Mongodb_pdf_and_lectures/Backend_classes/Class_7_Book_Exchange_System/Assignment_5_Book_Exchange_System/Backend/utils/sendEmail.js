// ======================================================
// Email Utility
// ======================================================
//
// Sends transactional emails (currently just password resets) via Gmail
// SMTP through nodemailer. This needs EMAIL_USER / EMAIL_PASS in .env —
// EMAIL_PASS must be a Gmail "App Password", NOT your regular Gmail
// password (Gmail blocks plain-password SMTP logins). To get one:
//
//   1. Turn on 2-Step Verification on the Gmail account:
//      https://myaccount.google.com/security
//   2. Go to https://myaccount.google.com/apppasswords
//   3. Create an app password (name it anything, e.g. "Chapter & Verse")
//   4. Copy the 16-character password Google gives you into
//      EMAIL_PASS in .env (EMAIL_USER is the Gmail address itself)
//
// If these aren't set, sendEmail() throws a clear error instead of
// silently failing or crashing the server.

const nodemailer = require("nodemailer");

const getTransporter = () => {

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {

        throw new Error(
            "Email isn't configured on this server. Set EMAIL_USER and EMAIL_PASS in .env (see Backend/utils/sendEmail.js for setup steps)."
        );

    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

};

const sendEmail = async ({ to, subject, html }) => {

    const transporter = getTransporter();

    await transporter.sendMail({
        from: `"Chapter & Verse" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

};

module.exports = sendEmail;
