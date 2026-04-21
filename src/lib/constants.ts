export const FLODON_SERVICES = [
  {
    id: 'ai_personal_branding_systems',
    label: 'AI Personal Branding Systems',
    description: 'We build and run AI-powered personal branding systems that give founders and businesses consistent visibility, authority, and content output without daily manual effort, so their brand compounds while they focus on running the business.',
  },
  {
    id: 'ai_customer_interaction_systems',
    label: 'AI Customer Interaction Systems',
    description: 'We design custom AI chatbots aligned to business goals that handle customer conversations end to end, improving response speed, lead quality, and overall user experience without relying on generic templates.',
  },
  {
    id: 'ai_operations_automation_systems',
    label: 'AI Operations and Automation Systems',
    description: 'We automate internal workflows, lead handling, follow ups, and communication, then scale those automations into custom AI agents that reduce manual work and position us as a long term operations partner.',
  },
  {
    id: 'ai_voice_calling_systems',
    label: 'AI Voice and Calling Systems',
    description: 'We deploy AI calling agents that manage customer support, inbound leads, and outbound follow ups reliably, allowing businesses to scale communication without increasing team size.',
  },
  {
    id: 'whatsapp_ai_conversation_systems',
    label: 'WhatsApp AI Conversation Systems',
    description: 'We build WhatsApp chatbots that handle support, lead qualification, bookings, and follow ups while integrating with CRMs and internal systems to deliver faster responses and stronger lead handling.',
  },
  {
    id: 'instagram_ai_growth_systems',
    label: 'Instagram AI Growth Systems',
    description: 'We create Instagram chatbots designed for growth using comment-to-DM flows, story replies, and automated conversations that turn engagement into qualified leads at scale.',
  },
  {
    id: 'website_ai_conversion_systems',
    label: 'Website AI Conversion Systems',
    description: 'We implement website chatbots that guide visitors, answer questions, and capture leads intelligently, increasing conversion rates and improving the overall browsing experience.',
  },
];

export const getServiceLabel = (id: string) => {
  return FLODON_SERVICES.find(s => s.id === id)?.label || id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General';
};
