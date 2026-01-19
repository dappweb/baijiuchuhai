export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json()
  
  const admin = await env.DB.prepare(
    'SELECT * FROM admins WHERE username = ?'
  ).bind(username).first()
  
  if (!admin) {
    return new Response('Invalid credentials', { status: 401 })
  }
  
  // 简单密码验证 (生产环境应使用 bcrypt)
  const crypto = await import('crypto')
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  
  if (hash !== admin.password_hash) {
    return new Response('Invalid credentials', { status: 401 })
  }
  
  // 生成简单 token (生产环境应使用 JWT)
  const token = crypto.randomBytes(32).toString('hex')
  
  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
