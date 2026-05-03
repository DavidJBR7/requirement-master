package com.requirementmaster.backend.application.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:Requirement Master}")
    private String appName;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendPasswordResetCode(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, appName);
            helper.setTo(to);
            helper.setSubject("Codigo de recuperacion de contrasena - " + appName);

            String htmlContent = buildPasswordResetEmail(code);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Correo de recuperación enviado exitosamente a: {}", to);

        } catch (Exception e) {
            log.error("Error al enviar correo de recuperación a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("No se pudo enviar el correo de recuperación. Intente nuevamente.", e);
        }
    }

    @Async
    protected String buildPasswordResetEmail(String code) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 12px;
                            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 32px;
                            text-align: center;
                        }
                        .header h1 {
                            color: white;
                            margin: 0;
                            font-size: 28px;
                            font-weight: 700;
                        }
                        .content {
                            padding: 40px 32px;
                        }
                        .code-container {
                            background: #f8f9fa;
                            border: 2px dashed #667eea;
                            border-radius: 12px;
                            padding: 24px;
                            margin: 24px 0;
                            text-align: center;
                        }
                        .code {
                            font-size: 36px;
                            font-weight: bold;
                            color: #667eea;
                            letter-spacing: 8px;
                            margin: 0;
                        }
                        .warning {
                            background: #fff3cd;
                            border: 1px solid #ffc107;
                            border-radius: 8px;
                            padding: 16px;
                            margin-top: 24px;
                            color: #856404;
                            font-size: 14px;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 24px;
                            text-align: center;
                            color: #6c757d;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Recuperacion de Contrasena</h1>
                        </div>
                        <div class="content">
                            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                Estimado usuario,<br><br>
                                Ha solicitado restablecer su contrasena en <strong>"""
                + appName + """
                </strong>.
                                Utilice el siguiente codigo para completar el proceso:
                            </p>
                            
                            <div class="code-container">
                                <p style="color: #666; margin-bottom: 12px;">Su codigo de verificacion es:</p>
                                <div class="code">"""
                + code + """
                </div>
                            </div>
                            
                            <p style="font-size: 14px; color: #666;">
                                Este codigo expirara en <strong>15 minutos</strong>.
                                Si no solicito este cambio, puede ignorar este correo.
                            </p>
                            
                            <div class="warning">
                                <strong>Importante:</strong> No comparta este codigo con nadie.
                                Ningun empleado de """
                + appName + """
                                le solicitara este codigo.
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2026 """
                + appName + """
                . Todos los derechos reservados.</p>
                            <p style="font-size: 12px;">Este es un correo automatico, por favor no responda.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }
}