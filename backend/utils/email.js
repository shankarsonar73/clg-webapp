import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // Use TLS (true for port 465, false for 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // ✅ Ignore self-signed certificate issue
  }
});

export const sendFacultyApprovalEmail = async (to, status) => {
  const subject = status === 'approved' 
    ? 'Faculty Account Approved' 
    : 'Faculty Account Request Update';
  
  const text = status === 'approved'
    ? 'Your faculty account has been approved. You can now login to the system.'
    : 'Your faculty account request is pending approval. You will be notified once approved.';

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};