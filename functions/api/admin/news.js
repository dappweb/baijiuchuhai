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
    'SELECT * FROM news ORDER BY created_at DESC'
  ).all()
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function onRequestPost({ request, env }) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { title, summary, content, cover_image_url, publish_date } = await request.json()
  
  if (!title) {
    return new Response('Title is required', { status: 400 })
  }
  
  await env.DB.prepare(
    'INSERT INTO news (title, summary, content, cover_image_url, publish_date) VALUES (?, ?, ?, ?, ?)'
  ).bind(title, summary || '', content || '', cover_image_url || '', publish_date || '').run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function onRequestPut({ request, env }) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { id, title, summary, content, cover_image_url, publish_date } = await request.json()
  
  if (!id || !title) {
    return new Response('ID and Title are required', { status: 400 })
  }
  
  await env.DB.prepare(
    'UPDATE news SET title = ?, summary = ?, content = ?, cover_image_url = ?, publish_date = ? WHERE id = ?'
  ).bind(title, summary || '', content || '', cover_image_url || '', publish_date || '', id).run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function onRequestDelete({ request, env }) {
  if (!verifyAuth(request)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return new Response('ID is required', { status: 400 })
  }
  
  await env.DB.prepare('DELETE FROM news WHERE id = ?').bind(id).run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
