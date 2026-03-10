import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Debug endpoint to test email configuration
 * GET /api/debug/email - Returns environment status
 * POST /api/debug/email - Sends a test email
 */

export async function GET() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const portfolioEmail = process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return NextResponse.json({
    config: {
      resendApiKeySet: !!resendApiKey,
      resendApiKeyLength: resendApiKey ? resendApiKey.length : 0,
      portfolioEmail: portfolioEmail || "NOT SET",
      fromEmail: fromEmail,
      appUrl: appUrl || "NOT SET",
      environment: process.env.NODE_ENV,
    },
    status: {
      ready: !!(resendApiKey && portfolioEmail),
      message:
        resendApiKey && portfolioEmail
          ? "✅ Configuration looks good!"
          : "❌ Missing configuration: " +
            (!resendApiKey ? "RESEND_API_KEY " : "") +
            (!portfolioEmail ? "NEXT_PUBLIC_PORTFOLIO_EMAIL" : ""),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const portfolioEmail = process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 400 },
      );
    }

    if (!portfolioEmail) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_PORTFOLIO_EMAIL not configured" },
        { status: 400 },
      );
    }

    const resend = new Resend(resendApiKey);

    const testEmail = await resend.emails.send({
      from: fromEmail,
      to: portfolioEmail,
      subject: "🧪 Test Email from Portfolio (Debug)",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #667eea;">✅ Test Email Successful!</h2>
          <p>If you're reading this, your Resend configuration is working correctly.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>From:</strong> ${fromEmail}</p>
            <p><strong>To:</strong> ${portfolioEmail}</p>
            <p><strong>API Key (first 10 chars):</strong> ${resendApiKey.substring(0, 10)}...</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            This is a test email. Your portfolio contact form should now work correctly.
          </p>
        </div>
      `,
    });

    // Resend returns { data: { id }, error } format
    if (testEmail.error) {
      return NextResponse.json(
        {
          error: "Email failed to send",
          details: testEmail.error,
        },
        { status: 400 },
      );
    }

    if (!testEmail.data?.id) {
      return NextResponse.json(
        {
          error: "Email may not have been sent - no ID returned",
          details: testEmail,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Test email sent successfully!",
      emailId: testEmail.data.id,
      config: {
        from: fromEmail,
        to: portfolioEmail,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
