function verifyAuth(request) {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return false
  }
  return true
}

export async function onRequestGet({ request, env }) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { results } = await env.DB.prepare(
    'SELECT * FROM leads ORDER BY created_at DESC'
  ).all()
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  })
}
