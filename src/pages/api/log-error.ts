import fs from 'fs';
import path from 'path';

export async function post({ request }) {
  const { message } = await request.json();
  const logPath = path.join(process.cwd(), 'error.log');
  
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;

  fs.appendFileSync(logPath, logMessage);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
