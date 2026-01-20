export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json()
  
  const admin = await env.DB.prepare(
    'SELECT * FROM admins WHERE username = ?'
  ).bind(username).first()
  
  if (!admin) {
    return new Response('Invalid credentials', { status: 401 })
  }
  
  // 简单密码验证 (生产环境应使用 bcrypt)
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  if (hash !== admin.password_hash) {
    return new Response('Invalid credentials', { status: 401 })
  }
  
  // 生成简单 token (生产环境应使用 JWT)
  const tokenArray = new Uint8Array(32)
  crypto.getRandomValues(tokenArray)
  const token = Array.from(tokenArray).map(b => b.toString(16).padStart(2, '0')).join('')
  
  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
