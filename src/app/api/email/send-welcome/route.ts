import { POST as outreachPOST } from '../send-outreach/route';

// This is a proxy route to prevent 404s for any old sessions still calling 'send-welcome'
export async function POST(request: Request) {
  return outreachPOST(request);
}
