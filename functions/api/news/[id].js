export async function onRequestGet({ env, params }) {
  const { id } = params
  const result = await env.DB.prepare(
    'SELECT * FROM news WHERE id = ?'
  ).bind(id).first()
  
  if (!result) {
    return new Response('Not found', { status: 404 })
  }
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
}
