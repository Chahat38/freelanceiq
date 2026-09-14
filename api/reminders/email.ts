export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Check status of email configuration
  if (req.method === 'GET') {
    const resendApiKey = process.env.RESEND_API_KEY;
    const isConfigured = Boolean(
      resendApiKey &&
      resendApiKey !== 'YOUR_RESEND_API_KEY' &&
      resendApiKey.trim().length > 0
    );

    return res.status(200).json({
      configured: isConfigured,
      provider: isConfigured ? 'Resend' : null,
      message: isConfigured
        ? 'Email reminder service is configured and ready.'
        : 'Email reminders are optional and currently unconfigured. Set RESEND_API_KEY in your Vercel project environment variables to enable.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    const { to, taskTitle, dueDate, priority, notes } = req.body || {};

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey || resendApiKey === 'YOUR_RESEND_API_KEY' || !resendApiKey.trim()) {
      return res.status(200).json({
        success: false,
        configured: false,
        message:
          'Email reminders are optional and not configured in this environment. Set RESEND_API_KEY in Vercel project settings to enable email notifications.',
      });
    }

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid recipient email address is required.',
      });
    }

    const fromEmail = process.env.EMAIL_FROM || 'reminders@freelanceiq.ai';

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5; margin-bottom: 8px;">FreelanceIQ Task Reminder</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 0;">Stay on top of your freelance deliverables.</p>
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">${taskTitle || 'Untitled Task'}</h3>
          <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>Due Date:</strong> ${dueDate || 'Not set'}</p>
          <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${priority === 'high' ? '#ef4444' : '#6366f1'}; font-weight: bold;">${priority || 'MEDIUM'}</span></p>
          ${notes ? `<p style="margin: 8px 0 0 0; color: #475569; font-size: 13px;"><em>${notes}</em></p>` : ''}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Sent automatically by your FreelanceIQ AI Operating System.</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey.trim()}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: `⏰ Task Reminder: ${taskTitle || 'Deliverable Due'}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        error: errData.message || 'Failed to dispatch email via provider',
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      configured: true,
      message: `Email reminder queued for ${to}`,
      id: data.id,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal error processing email reminder',
    });
  }
}
