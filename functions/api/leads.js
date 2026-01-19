export async function onRequestPost({ request, env }) {
  const { name, phone, company, message } = await request.json()
  
  if (!name || !phone) {
    return new Response('Name and phone are required', { status: 400 })
  }
  
  await env.DB.prepare(
    'INSERT INTO leads (name, phone, company, message) VALUES (?, ?, ?, ?)'
  ).bind(name, phone, company || '', message || '').run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
