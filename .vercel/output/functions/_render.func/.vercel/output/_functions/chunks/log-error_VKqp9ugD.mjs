import fs from 'fs';
import path from 'path';

async function post({ request }) {
  const { message } = await request.json();
  const logPath = path.join(process.cwd(), "error.log");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logMessage = `${timestamp}: ${message}
`;
  fs.appendFileSync(logPath, logMessage);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export { post };
