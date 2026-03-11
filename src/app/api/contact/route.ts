import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

// Email configuration - customize these for your domain
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
const PORTFOLIO_EMAIL = process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL;
const PORTFOLIO_NAME =
  process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Portfolio Team";

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");
const resend = new Resend(resendApiKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Store in database
    const { data: storedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          message,
          read: false,
        },
      ])
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 },
      );
    }

    // Send email notification to your Gmail inbox
    if (!resendApiKey) {
      console.error(
        "ERROR: RESEND_API_KEY is not set. Emails will not be sent in production. Add it to your environment variables.",
      );
    }
    if (!PORTFOLIO_EMAIL) {
      console.error(
        "ERROR: NEXT_PUBLIC_PORTFOLIO_EMAIL is not set. Emails will not be sent in production. Add it to your environment variables.",
      );
    }

    if (resendApiKey && PORTFOLIO_EMAIL) {
      try {
        const response = await resend.emails.send({
          from: FROM_EMAIL,
          to: PORTFOLIO_EMAIL, // This should be your Gmail address
          replyTo: email,
          subject: `📧 New Message from ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; border-radius: 12px 12px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700;">📧 New Contact Message</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">You have a new message from your portfolio</p>
              </div>
              
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px 24px;">
                <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                  <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From:</label>
                    <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 500;">${name}</p>
                  </div>
                  
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Reply To:</label>
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${email}</a>
                  </div>
                </div>
                
                <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; border-left: 4px solid #667eea; margin-bottom: 24px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message:</label>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</p>
                </div>
                
                <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://yourportfolio.com"}/admin/messages" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    View in Admin Panel
                  </a>
                </div>
                
                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
                  <p style="margin: 0;">Message received at ${new Date().toLocaleString()}</p>
                  <p style="margin: 8px 0 0 0;">This is an automated email from your portfolio contact form.</p>
                </div>
              </div>
            </div>
          `,
        });

        if (response.error) {
          console.error("Resend API Error:", response.error);
          // Email failed but message is stored in DB
        } else if (response.data?.id) {
          console.log("✅ Email sent successfully:", response.data.id);
        } else {
          console.warn("⚠️  Email may not have been sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request - message is stored in DB
      }
    } else {
      console.warn(
        "Email service not configured. Set RESEND_API_KEY and NEXT_PUBLIC_PORTFOLIO_EMAIL environment variables.",
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully! You will receive an email shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + String(error) },
      { status: 500 },
    );
  }
}
