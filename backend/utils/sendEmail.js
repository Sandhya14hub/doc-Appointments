const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("EMAIL ERROR:");
    console.error(err);
    throw err;
  }
};