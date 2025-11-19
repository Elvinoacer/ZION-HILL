export const birthdayEmailTemplate = (name: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .header {
          background-color: #4a90e2;
          color: white;
          padding: 1rem;
          text-align: center;
        }
        .content {
          padding: 2rem;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Happy Birthday, ${name}!</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We, at Zion Hill, are wishing you a very happy birthday! We pray that you have a wonderful day filled with joy, laughter, and God's blessings.</p>
          <p>With love,</p>
          <p>Your Church Family</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Zion Hill. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
