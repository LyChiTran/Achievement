from typing import Optional
import os

try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False
    print("⚠️  SendGrid not installed - OTP will print to console only")


class EmailService:
    """Service for sending emails via SendGrid"""
    
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@achievementweb.com")
        
        # Debug logging
        print(f"\n🔍 Email Service Init:")
        print(f"  - SendGrid available: {SENDGRID_AVAILABLE}")
        print(f"  - API Key present: {'Yes' if self.api_key else 'No'}")
        print(f"  - API Key length: {len(self.api_key) if self.api_key else 0}")
        print(f"  - From email: {self.from_email}\n")
        
        self.client = SendGridAPIClient(self.api_key) if (self.api_key and SENDGRID_AVAILABLE) else None
        
        if not self.client:
            print("⚠️  SendGrid client NOT initialized - emails will print to console")
        else:
            print("✅ SendGrid client initialized - emails will be sent via SendGrid")
    
    def send_otp_email(self, to_email: str, otp_code: str, user_name: Optional[str] = None) -> bool:
        """Send OTP code via email using SendGrid dynamic template"""
        if not self.client:
            # For development: print OTP to console
            print(f"\n{'='*50}")
            print(f"📧 OTP EMAIL (Development Mode)")
            print(f"To: {to_email}")
            print(f"OTP Code: {otp_code}")
            print(f"{'='*50}\n")
            return True
        
        try:
            # Use dynamic template
            template_id = os.getenv("SENDGRID_TEMPLATE_ID")
            
            if template_id:
                # Send with dynamic template
                from sendgrid.helpers.mail import Mail
                
                message = Mail(
                    from_email=self.from_email,
                    to_emails=to_email
                )
                message.template_id = template_id
                message.dynamic_template_data = {
                    'otp_code': otp_code,
                    'user_name': user_name or 'User',
                }
                
                response = self.client.send(message)
                return response.status_code == 202
            else:
                # Fallback to custom HTML
                subject = "Your OTP Code - Password Reset"
                
                html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .otp-box {{ background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
                        .otp-code {{ font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }}
                        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset</h1>
                        </div>
                        <div class="content">
                            <p>Hello{f" {user_name}" if user_name else ""},</p>
                            <p>You requested to reset your password for your Achievement Web account.</p>
                            <p>Here is your OTP code:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">{otp_code}</div>
                            </div>
                            
                            <p><strong>This code will expire in 10 minutes.</strong></p>
                            <p>If you did not request a password reset, please ignore this email.</p>
                            
                            <div class="footer">
                                <p>© 2026 Achievement Web. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                message = Mail(
                    from_email=self.from_email,
                    to_emails=to_email,
                    subject=subject,
                    html_content=html_content
                )
                
                response = self.client.send(message)
                return response.status_code == 202
                
        except Exception as e:
            print(f"Error sending email: {e}")
            # In development, still return True so flow continues
            return True
    
    def send_registration_otp(self, to_email: str, otp_code: str, user_name: Optional[str] = None) -> bool:
        """Send OTP code for registration verification"""
        if not self.client:
            # For development: print OTP to console
            print(f"\n{'='*50}")
            print(f"📧 REGISTRATION OTP (Development Mode)")
            print(f"To: {to_email}")
            print(f"OTP Code: {otp_code}")
            print(f"{'='*50}\n")
            return True
        
        subject = "Welcome! Verify Your Email"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .otp-box {{ background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to Achievement Web!</h1>
                </div>
                <div class="content">
                    <p>Hello{f" {user_name}" if user_name else ""},</p>
                    <p>Thank you for registering! Please verify your email with the code below:</p>
                    
                    <div class="otp-box">
                        <div class="otp-code">{otp_code}</div>
                    </div>
                    
                    <p><strong>This code will expire in 10 minutes.</strong></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            
            response = self.client.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"Error sending email: {e}")
            return True
    
    def send_password_reset_confirmation(self, to_email: str, user_name: Optional[str] = None) -> bool:
        """Send confirmation email after password reset"""
        if not self.client:
            print(f"\n📧 Password reset confirmation sent to {to_email}\n")
            return True
        
        subject = "Password Reset Successful"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .success {{ background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success">
                    <h1>✅ Password Reset Successfully</h1>
                </div>
                <div class="content">
                    <p>Hello{f" {user_name}" if user_name else ""},</p>
                    <p>Your password has been reset successfully.</p>
                    <p>You can now log in with your new password.</p>
                    <p>If you did not make this change, please contact us immediately.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            
            response = self.client.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"Error sending email: {e}")
            return True


email_service = EmailService()
