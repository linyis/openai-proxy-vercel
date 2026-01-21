// Vercel Edge Function 程式碼 (儲存為 api/openai.js)

export default async function handler(request) {
  const OPENAI_BASE_URL = "https://api.openai.com";
  const url = new URL(request.url );
  
  // 移除 /api 前綴，確保路徑正確轉發到 OpenAI
  const path = url.pathname.replace('/api/openai', ''); 
  const targetUrl = OPENAI_BASE_URL + path;

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  // 確保 Authorization Header 被正確傳遞
  newRequest.headers.set('Authorization', request.headers.get('Authorization'));

  try {
    const response = await fetch(newRequest);
    return response;
  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}
