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
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 0;
      padding: 20px;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
    }
    .link-button {
      color: #6C63FF;
      text-decoration: underline;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      font-size: 13px;
      color: #71717a;
    }
    .logo-text {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 30px;
      color: #000;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo-text">FLODON</div>
    
    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <p>—<br/>
      <strong>Flodon AI Agency</strong><br/>
      <span style="font-size: 11px; color: #a1a1aa;">Intelligent Growth for Modern Brands</span></p>
      <p style="font-size: 11px; margin-top: 20px;">
        <a href="#" style="color: #a1a1aa; text-decoration: underline;">Unsubscribe</a> from these updates
      </p>
    </div>
  </div>
</body>
</html>
`;

const getSteps = () => `
  <p><strong>Here’s what happens next:</strong></p>
  <ul>
    <li><strong>Strategy Call:</strong> We'll dive deep into your goals and current roadblocks.</li>
    <li><strong>Custom Roadmapping:</strong> We'll design a tailored execution plan specific to your brand.</li>
    <li><strong>Rapid Deployment:</strong> We start building and implementing within 48 hours of onboarding.</li>
  </ul>
`;

const templates: Record<string, (props: TemplateProps) => string> = {
  'AI Automation': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll automate your repetitive workflows using custom AI agents, saving your team 20+ hours per week. By eliminating manual bottlenecks, your team can focus on what actually drives revenue.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Lead Generation': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll build you a predictable pipeline of qualified leads using data-driven outreach systems. Stop stressing about where your next client is coming from and start scaling with confidence.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Content Marketing': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll create content that positions your brand as the authority in your industry. Through strategic storytelling and SEO-driven insights, we turn your brand into a magnet for your ideal customers.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Social Media Management': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll grow your brand's social presence with consistent, high-quality content that converts. Let us handle the creative heavy lifting while you focus on closing the inbound attention.</p>
    ${getSteps()}
    <a href="#" class="link-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Paid Ads': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll run laser-targeted ad campaigns that turn your ad spend into measurable revenue. Using algorithmic bidding and advanced split-testing, we ensure your brand gets maximum ROI on every dollar.</p>
    ${getSteps()}
    <a href="#" class="link-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'SEO': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll get your brand ranking on Google for the searches your ideal customers are already making. It’s time to capture high-intent traffic and build a moat around your digital presence.</p>
    ${getSteps()}
    <a href="#" class="link-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Web Development': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll build a high-converting, blazing-fast website that works as your best salesperson. We merge modern design aesthetics with conversion-rate-optimization principles to craft digital experiences that sell.</p>
    ${getSteps()}
    <a href="#" class="link-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Other': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>I'm reaching out from Flodon AI to connect with ${brandName || 'your team'}.</p>
    <p>We'll help your business achieve intelligent growth with our modern, data-driven solutions. Let's work together to streamline operations and scale your revenue efficiently.</p>
    ${getSteps()}
    <a href="#" class="link-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `)
};

export const getEmailTemplate = (service: string, props: TemplateProps) => {
  const getTemplate = templates[service] || templates['Other'];
  return getTemplate(props);
};
