export interface TemplateProps {
  clientName: string;
  brandName?: string;
  employeeName: string;
}

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue";
      background-color: #FFFFFF;
      color: #0A0A0A;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #6C63FF;
      margin-bottom: 40px;
      letter-spacing: -0.5px;
    }
    .content {
      font-size: 16px;
      color: #333333;
    }
    .cta-button {
      display: inline-block;
      background-color: #6C63FF;
      color: #FFFFFF;
      padding: 14px 28px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 30px 0;
      text-align: center;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #EAEAEA;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
    .tagline {
      font-style: italic;
      color: #666;
      margin-bottom: 10px;
    }
    .unsubscribe {
      color: #888888;
      text-decoration: underline;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <!-- To be replaced with /public/logo.png later -->
      FLODON
    </div>
    
    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <div class="tagline">Intelligent Growth for Modern Brands</div>
      <p>© ${new Date().getFullYear()} Flodon AI Agency. All rights reserved.</p>
      <p>If you no longer wish to receive these emails, you can <a href="#" class="unsubscribe">unsubscribe here</a>.</p>
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
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll automate your repetitive workflows using custom AI agents, saving your team 20+ hours per week. By eliminating manual bottlenecks, your team can focus on what actually drives revenue.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Lead Generation': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll build you a predictable pipeline of qualified leads using data-driven outreach systems. Stop stressing about where your next client is coming from and start scaling with confidence.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Content Marketing': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll create content that positions your brand as the authority in your industry. Through strategic storytelling and SEO-driven insights, we turn your brand into a magnet for your ideal customers.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Social Media Management': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll grow your brand's social presence with consistent, high-quality content that converts. Let us handle the creative heavy lifting while you focus on closing the inbound attention.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Paid Ads': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll run laser-targeted ad campaigns that turn your ad spend into measurable revenue. Using algorithmic bidding and advanced split-testing, we ensure your brand gets maximum ROI on every dollar.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'SEO': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll get your brand ranking on Google for the searches your ideal customers are already making. It’s time to capture high-intent traffic and build a moat around your digital presence.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Web Development': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll build a high-converting, blazing-fast website that works as your best salesperson. We merge modern design aesthetics with conversion-rate-optimization principles to craft digital experiences that sell.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `),

  'Other': ({ clientName, brandName, employeeName }) => baseLayout(`
    <p>Hi ${clientName},</p>
    <p>Welcome to Flodon. We're thrilled to connect with ${brandName || 'your team'}.</p>
    <p>We'll help your business achieve intelligent growth with our modern, data-driven solutions. Let's work together to streamline operations and scale your revenue efficiently.</p>
    ${getSteps()}
    <a href="#" class="cta-button">Book Your Free Strategy Call</a>
    <p>Best regards,<br/>${employeeName}<br/>Flodon Team</p>
  `)
};

export const getEmailTemplate = (service: string, props: TemplateProps) => {
  const getTemplate = templates[service] || templates['Other'];
  return getTemplate(props);
};
