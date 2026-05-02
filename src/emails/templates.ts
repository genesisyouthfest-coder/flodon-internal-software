export interface TemplateProps {
  clientName: string;
  brandName?: string;
  employeeName: string;
}

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      color: #0A0A0A;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #0A0A0A;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    .divider {
      border: 0;
      border-top: 1px solid #0A0A0A;
      width: 100%;
      margin: 0 auto 40px;
      height: 1px;
    }
    .content {
      margin-bottom: 40px;
    }
    .cta-container {
      margin: 40px 0;
    }
    .cta-button {
      background-color: #0A0A0A;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      display: inline-block;
      text-align: center;
    }
    ul {
      padding-left: 20px;
      margin: 20px 0;
    }
    li {
      margin-bottom: 12px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid #DDDDDD;
      text-align: center;
      font-size: 13px;
      color: #888888;
    }
    .footer-links {
      margin-top: 20px;
    }
    .footer-links a {
      color: #888888;
      text-decoration: underline;
    }
    p {
      margin-bottom: 24px;
    }
    strong {
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">FLODON</div>
      <hr class="divider">
    </div>
    
    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <p><strong>Flodon</strong> — flodon.in<br/>
      AI Automation Agency · Worldwide</p>
      <div class="footer-links">
        <a href="#">Unsubscribe</a> from these updates
      </div>
    </div>
  </div>
</body>
</html>
`;

export const templates: Record<string, { subject: string, body: (props: TemplateProps) => string }> = {
  'flodon_ai_business_system': {
    subject: 'System Architecture — Operational gaps at {{BRAND}}',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>Operational friction is usually the invisible ceiling for growing companies like ${brandName || 'yours'}.</p>
      <p>We build connected AI systems that replace manual repetitive work and run your core operations autonomously. Instead of managing tools, we architect a unified layer that handles attention and execution for you, 24/7.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Gap Analysis:</strong> We map where human bottlenecks are killing your throughput.</li>
        <li><strong>Architecture:</strong> We design and deploy your custom AI state machine.</li>
        <li><strong>Automation:</strong> Your business begins running on an autonomous operational layer.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'ai_personal_branding': {
    subject: 'Leveraging visibility for {{BRAND}}',
    body: ({ clientName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>Most business owners are competent but invisible. In today's market, brand is the only long-term leverage.</p>
      <p>We turn one 30-minute conversation with you into 20+ precise pieces of content that dominate your niche. We've bridged the gap between having expertise and having an authority presence, so you can focus on building while the AI handles the distribution.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Voice Mapping:</strong> We extract and digitize your unique authority and brand voice.</li>
        <li><strong>Pipeline Sync:</strong> We build the custom content engine tailored to your audience.</li>
        <li><strong>Domination:</strong> You move from a builder to a recognized industry authority.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'ai_customer_interaction': {
    subject: 'Delayed replies are costing {{BRAND}} leads',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>If a lead inquiries and doesn't get a response in 5 minutes, the conversion probability drops by 80%.</p>
      <p>We deploy intelligent AI agents for ${brandName || 'your business'} that answer questions exactly like your best representative. They handle objections, qualify prospects, and book appointments 24/7 without ever taking a break or missing a chat.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Knowledge Sync:</strong> We train your AI on your specific services and edge cases.</li>
        <li><strong>Logic Build:</strong> We design the conversation trees that lead to conversions.</li>
        <li><strong>Deployment:</strong> Your lead response time effectively drops to zero.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'ai_voice_calling': {
    subject: 'Lead response time: 60 seconds for {{BRAND}}',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>Missed calls at ${brandName || 'your company'} are simply missed revenue. Human lag in follow-up is the biggest bottleneck in sales.</p>
      <p>Our AI voice agents call every lead back in under 60 seconds. They speak with natural latency, qualify the opportunity, and book the meeting directly into your calendar and CRM. It's the precision of a specialist with the availability of a machine.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Script Architecture:</strong> We map the high-conversion voice workflows for your leads.</li>
        <li><strong>Voice Synthesis:</strong> We configure the natural-sounding AI agents for your brand.</li>
        <li><strong>Execution:</strong> Every single lead gets an immediate, professional call, 24/7.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'whatsapp_automation': {
    subject: 'Scalable WhatsApp operations for {{BRAND}}',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>WhatsApp is the world's most personal inbox, but for ${brandName || 'businesses'}, it's often the hardest to manage at scale.</p>
      <p>We build sophisticated WhatsApp architectures that handle broadcasting, zero-latency instant replies, and structured qualification flows. We move your WhatsApp from a chaotic support channel to a structured, autonomous revenue engine.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Flow Design:</strong> We map the user journey from inquiry to booked appointment.</li>
        <li><strong>API Integration:</strong> We connect your WhatsApp directly to your core CRM data.</li>
        <li><strong>Scaling:</strong> You handle thousands of chats with the same precision as one.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'website_ai_conversion': {
    subject: 'Turning {{BRAND}} traffic into booked calls',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>Most visitors on ${brandName || 'your website'} leave because their specific question wasn't answered in the first 10 seconds.</p>
      <p>We embed intelligent conversion layers that actively engage every visitor. Instead of a static page, your website becomes an active salesperson that guides prospects, handles objections, and ensures that high-intent traffic doesn't just bounce, but books.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Conversion Audit:</strong> We identify where visitors are dropping off your site.</li>
        <li><strong>AI Training:</strong> We build the knowledge base the AI uses to convert visitors.</li>
        <li><strong>Implementation:</strong> Your site starts work as a proactive sales agent, 24/7.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  },

  'Other': {
    subject: 'Automating the work that slows down {{BRAND}}',
    body: ({ clientName, brandName, employeeName }) => baseLayout(`
      <p>Hi ${clientName},</p>
      <p>We automate the work that slows you down.</p>
      <p>Flodon builds highly precise AI systems for businesses like ${brandName || 'yours'} that replace repetitive manual workflows, intelligently convert more leads, and autonomously run your core operations while you focus on scaling.</p>
      <p><strong>What Happens Next:</strong></p>
      <ul>
        <li><strong>Audit:</strong> We map your biggest operational gaps and design the workflow.</li>
        <li><strong>Build:</strong> We design, configure, and deploy the system — fully tested.</li>
        <li><strong>Scale:</strong> We monitor and optimise the system monthly for peak performance.</li>
      </ul>
      <div class="cta-container">
        <a href="https://calendly.com/sanskarkolekarr/flodon" class="cta-button">Book Your Free Call</a>
      </div>
      <p>No commitment. Just clarity.</p>
      <p>Best,<br/>${employeeName} — Flodon</p>
    `)
  }
};

export const getEmailTemplate = (service: string, props: TemplateProps) => {
  const template = templates[service] || templates['Other'];
  const body = template.body(props);
  const subject = template.subject.replace('{{BRAND}}', props.brandName || props.clientName);
  
  return { subject, html: body };
};
