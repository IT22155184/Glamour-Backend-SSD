import { Payment } from "../models/paymentModel.js";
import nodemailer from "nodemailer";
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

class PaymentService {
  constructor() {
    // Configure nodemailer transporter
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'glamouronline2024@gmail.com',
        pass: 'pyfr rmim veud rcyg',
      },
    });
  }

  /**
   * Generate payment PDF receipt
   * @param {Object} paymentDetails - Payment details
   * @returns {Stream} - PDF stream
   */
  generatePaymentPDF(paymentDetails) {
    const doc = new PDFDocument();
    const stream = new PassThrough();
    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(20).text("Payment Receipt", { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${paymentDetails.firstName} ${paymentDetails.lastName}`);
    doc.text(`Contact: ${paymentDetails.contact}`);
    doc.text(`Email: ${paymentDetails.email}`);
    doc.text(`Bank: ${paymentDetails.bank}`);
    doc.text(`Branch: ${paymentDetails.branch}`);
    doc.text(`Amount: Rs.${paymentDetails.totalPay}.00`);
    doc.text(`Payment Slip:`);
    
    const base64Image = paymentDetails.slip.replace(/^data:image\/\w+;base64,/, '');

    // Add the payment slip image (converted from base64)
    if (base64Image) {
      const imageBuffer = Buffer.from(base64Image, 'base64');
      doc.image(imageBuffer, {
        fit: [250, 300],
        align: 'center',
        valign: 'center',
      });
      doc.moveDown();
    }

    doc.text("Thank you for your payment!", { align: 'center' });
    doc.end();

    return stream;
  }

  /**
   * Send payment success email with PDF attachment
   * @param {string} email - Recipient email
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise} - Email sending result
   */
  async sendPaymentSuccessEmail(email, paymentDetails) {
    try {
      const pdfStream = this.generatePaymentPDF(paymentDetails);

      const mailOptions = {
        from: 'glamouronline2024@gmail.com',
        to: email,
        subject: 'Payment Confirmation',
        text: `Dear ${paymentDetails.firstName} ${paymentDetails.lastName}, your payment was successful!`,
        html: `<p>Dear <b>${paymentDetails.firstName} ${paymentDetails.lastName}</b>,</p>
               <p>Your payment of <b>Rs. ${paymentDetails.totalPay}.00</b> for <b>${paymentDetails.bank}</b> was successful. We have received your payment slip.</p>
               <p>Thank you for your order!</p>`,
        attachments: [
          {
            filename: 'PaymentReceipt.pdf',
            content: pdfStream,
            contentType: 'application/pdf'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Error sending email', error: error.message };
    }
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Object} - Creation result
   */
  async createPayment(paymentData) {
    try {
      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'contact', 'email', 
        'bank', 'branch', 'totalPay', 'slip'
      ];

      const missingFields = requiredFields.filter(field => !paymentData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          status: 400,
          message: "All fields are required"
        };
      }

      const newPayment = {
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        contact: paymentData.contact,
        email: paymentData.email,
        bank: paymentData.bank,
        branch: paymentData.branch,
        totalPay: paymentData.totalPay,
        slip: paymentData.slip,
      };

      const payment = await Payment.create(newPayment);

      // Send email after successful payment creation
      await this.sendPaymentSuccessEmail(newPayment.email, newPayment);

      return {
        success: true,
        status: 201,
        payment
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Object} - Payment data or error
   */
  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return {
          success: false,
          status: 404,
          message: "Payment not found"
        };
      }

      return {
        success: true,
        status: 200,
        payment
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      };
    }
  }
}

export default new PaymentService();
