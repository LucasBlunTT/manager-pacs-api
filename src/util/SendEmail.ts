import nodemailer from 'nodemailer';

class SendEmail {
  private transport: nodemailer.Transporter;
  private htmlTemplate: string;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT ?? '2525', 10),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    this.htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email de Teste</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }
            .content {
                margin-top: 20px;
                font-size: 16px;
                color: #555;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                text-align: center;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Olá, Mundo!</div>
            <div class="content">
                <p>Este é um email de teste enviado via Node.js e Nodemailer.</p>
                <p>Se você recebeu este e-mail, significa que a configuração está funcionando corretamente!</p>
            </div>
            <div class="footer">© 2025 Lucas Silva. Todos os direitos reservados.</div>
        </div>
    </body>
 </html>`;
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transport.sendMail({
        from: 'Lucas Silva <',
        to: to,
        subject: subject,
        text: text,
        html: this.htmlTemplate,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default SendEmail;