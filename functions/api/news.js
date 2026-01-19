export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, title, summary, cover_image_url, publish_date FROM news ORDER BY created_at DESC'
  ).all()
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  })
}
