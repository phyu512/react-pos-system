using System.Net.Mail;
using System.Net;

namespace MyStorePOSAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            // Replace these with your actual SMTP settings (or put them in appsettings.json)
            var smtpHost = "smtp.gmail.com";
            var smtpPort = 587; // Gmail uses 587 for SSL/TLS
            var smtpUser = "administrator78@gmail.com";
            var smtpPass = "lehzwbfdrwkqnxfw";

            using (var client = new SmtpClient(smtpHost, smtpPort))
            {
                client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("administrator78@gmail.com", "Star Link System"),
                    Subject = subject,
                    Body = htmlMessage,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
