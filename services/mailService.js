let nodemailer = require("nodemailer");

module.exports = {
  registerMail: (mail, username, link, plainPassword = null) => {
    // Ensure the link uses HTTP instead of HTTPS for localhost
    if (link.includes('localhost')) {
      link = link.replace('https://', 'http://');
    }
  
    // Create the base message
    var message = `
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <p>Hi ${username},</p>
          <br>
          <p>We have received your registration on Matcha.</p>
          <p>We hope you will find what you are looking for on our platform.</p>
          <p>To get started on Matcha, please make sure to validate the following link: <a href="${link}">Click here</a></p>
          <br>`;
  
    // If password is provided, add it to the email
    if (plainPassword) {
      message += `
          <p>Your account has been created with the following credentials:</p>
          <p><strong>Password:</strong> ${plainPassword}</p>
          <br>`;
    }
  
    message += `
          <p>See you soon on Matcha.</p>
        </body>
      </html>`;
  
    // Use SMTP transport instead of sendmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahsanayaz17193@gmail.com',  // Your Gmail account
        pass: 'lgtq ttle qiar xlyq'      // Your app-specific password (not regular Gmail password)
      }
    });
  
    transporter.sendMail(
      {
        from: "registration@ahsanayaz17193",
        to: mail,
        subject: "Welcome to Matcha",
        html: message,
        contentType: "text/html"
      },
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Email sent successfully:", info);
        }
      }
    );
  },
  
  forgotPasswordMail: (mail, username, link) => {
        // Ensure the link uses HTTP instead of HTTPS for localhost
        if (link.includes('localhost')) {
          link = link.replace('https://', 'http://');
        }
    var message =
      `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ` +
      username +
      `,</p>
        <br>
        <p>We have received your password reset request on Matcha.</p>
        <p>Don't worry we got you covered ;)</p>
        <p>To reset your password on Matcha, please visit the following link: <a href="` +
      link +
      `">Click here</a></p>
        <br>
        <p>See you soon on Matcha.</p>
      </body>
    </html>`;

    // Use SMTP transport instead of sendmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ahsanayaz17193@gmail.com',  // Your Gmail account
        pass: 'lgtq ttle qiar xlyq'       // Your app-specific password
      }
    });
  
    transporter.sendMail(
      {
        from: "noreply@ahsanayaz17193",
        to: mail,
        subject: "Matcha - Reset password",
        html: message,
        contentType: "text/html"
      },
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Email sent successfully:", info);
        }
      }
    );
  }
};
