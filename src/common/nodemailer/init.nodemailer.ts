import * as nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
      user: "vulebaolong@gmail.com",
      pass: "nxnjbnbfntzjovsw",
   },
});

// Wrap in an async IIFE so we can use await.

export const sendMail = async (to) => {
   const info = await transporter.sendMail({
      from: '"Maddison Foo Koch" vulebaolong@gmail.com',
      to: to,
      subject: "Cảnh báo đăng nhập",
      text: "Cảnh bảo đăng nhập: tài khoản của bạn vừa mới thao tác đăng nhập ", // plain‑text body
      html: `<div>
         <p style="color: red">Cảnh báo đăng nhập</p> 
         <p>tài khoản của bạn vừa mới thao tác <b>đăng nhập</b></p> 
      </div>`, // HTML body
   });

   console.log("Message sent:", info.messageId);
};

