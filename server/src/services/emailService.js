const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const FROM = `"${process.env.SMTP_FROM_NAME || 'UrbanServe'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@urbanserve.com'}>`;

// ─── Templates ───────────────────────────────────────────────────────────────

const bookingConfirmationTemplate = (booking, customer) => ({
  subject: `Booking Confirmed — ${booking.bookingId}`,
  html: `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #E74C3C; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">UrbanServe</h1>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1A2B4A;">Booking Confirmed! 🎉</h2>
        <p>Hi ${customer.name || 'there'},</p>
        <p>Your booking <strong>${booking.bookingId}</strong> has been confirmed.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #E74C3C;">
          <p><strong>Service:</strong> ${booking.service?.name || 'Home Service'}</p>
          <p><strong>Scheduled:</strong> ${new Date(booking.scheduledAt).toLocaleString('en-IN')}</p>
          <p><strong>Address:</strong> ${booking.address?.line1}, ${booking.address?.city}</p>
          <p><strong>Amount:</strong> ₹${booking.pricing?.total}</p>
        </div>
        <div style="background: #fff3cd; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0;"><strong>Your Delivery OTP:</strong></p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E74C3C; margin: 8px 0;">
            ${booking.deliveryOtp || '----'}
          </p>
          <p style="font-size: 12px; color: #666; margin: 0;">Share this OTP with the professional only when the job is complete.</p>
        </div>
      </div>
    </div>
  `,
});

const newJobAlertTemplate = (booking, vendor) => ({
  subject: `New Job Request — ${booking.bookingId}`,
  html: `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1A2B4A; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">UrbanServe Vendor Portal</h1>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1A2B4A;">New Job Request 🔔</h2>
        <p>Hi ${vendor?.user?.name || 'Professional'},</p>
        <p>You have a new booking request <strong>${booking.bookingId}</strong>.</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #F39C12;">
          <p><strong>Service:</strong> ${booking.service?.name || 'Home Service'}</p>
          <p><strong>Scheduled:</strong> ${new Date(booking.scheduledAt).toLocaleString('en-IN')}</p>
          <p><strong>City:</strong> ${booking.address?.city}</p>
          <p><strong>Earning:</strong> ₹${booking.pricing?.total}</p>
        </div>
        <p>Please log in to your vendor dashboard to accept or reject this request within 30 minutes.</p>
      </div>
    </div>
  `,
});

const completionReceiptTemplate = (booking, customer) => ({
  subject: `Service Completed — ${booking.bookingId}`,
  html: `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #27AE60; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Service Completed ✅</h1>
      </div>
      <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 8px 8px;">
        <p>Hi ${customer.name || 'there'},</p>
        <p>Your service for booking <strong>${booking.bookingId}</strong> has been marked complete.</p>
        <p>Completed at: <strong>${new Date(booking.completedAt).toLocaleString('en-IN')}</strong></p>
        <p>We'd love to hear your feedback — please rate your experience in the app.</p>
      </div>
    </div>
  `,
});

// ─── Send Functions ───────────────────────────────────────────────────────────

const sendEmail = async (to, { subject, html }) => {
  if (!process.env.SMTP_USER) {
    logger.warn(`[EmailService] SMTP not configured. Skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    const info = await getTransporter().sendMail({ from: FROM, to, subject, html });
    logger.info(`[EmailService] Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    logger.error(`[EmailService] Failed to send email to ${to}:`, err.message);
    // Don't throw — email failure should not break the request
  }
};

const sendBookingConfirmation = (booking, customer) =>
  sendEmail(customer.email, bookingConfirmationTemplate(booking, customer));

const sendNewJobAlert = (booking, vendor) => {
  const email = vendor?.user?.email;
  if (email) sendEmail(email, newJobAlertTemplate(booking, vendor));
};

const sendCompletionReceipt = (booking, customer) => {
  if (customer.email) sendEmail(customer.email, completionReceiptTemplate(booking, customer));
};

// ─── SMS Placeholder (Twilio) ─────────────────────────────────────────────────
// To enable Twilio SMS:
// 1. npm install twilio in server
// 2. Uncomment and fill credentials in .env
// const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSms = async (to, message) => {
  logger.info(`[SMS Placeholder] To: ${to} — ${message}`);
  // await twilio.messages.create({ body: message, from: process.env.TWILIO_PHONE_NUMBER, to: `+91${to}` });
};

const sendOtpSms = (phone, otp) =>
  sendSms(phone, `Your UrbanServe OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`);

module.exports = {
  sendBookingConfirmation,
  sendNewJobAlert,
  sendCompletionReceipt,
  sendOtpSms,
  sendEmail,
};
