import nodemailer from "nodemailer";

const sendEmail = async (emailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailOptions.to,
            subject: emailOptions.subject,
            html: emailOptions.html
        });

        console.log("Email sent successfully");
        
    } catch (error) {
        console.log("Email sending failed", error);
    }
}

export default sendEmail;
