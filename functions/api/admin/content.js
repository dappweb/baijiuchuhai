
// GET /api/admin/content - 获取所有内容
export async function onRequestGet(context) {
    const { env } = context;
    const db = env.DB;
    const stmt = await db.prepare("SELECT id, content_key, content_value, last_updated FROM site_content ORDER BY last_updated DESC");
    const { results } = await stmt.all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
}

// POST /api/admin/content - 创建新内容
export async function onRequestPost(context) {
    const { env, request } = context;
    const db = env.DB;
    const { content_key, content_value } = await request.json();

    if (!content_key || !content_value) {
        return new Response("Missing key or value", { status: 400 });
    }

    try {
        const stmt = await db.prepare("INSERT INTO site_content (content_key, content_value) VALUES (?, ?)").bind(content_key, content_value);
        await stmt.run();
        return new Response("Content created successfully", { status: 201 });
    } catch (e) {
        // Handle potential unique constraint violation gracefully
        if (e.message.includes("UNIQUE constraint failed")) {
            return new Response(`Error: The key '${content_key}' already exists.`, { status: 409 });
        }
        return new Response(e.message, { status: 500 });
    }
}

// PUT /api/admin/content/:id - 更新内容
export async function onRequestPut(context) {
    const { env, request, params } = context;
    const db = env.DB;
    const id = params.id;
    const { content_value } = await request.json();

    if (!content_value) {
        return new Response("Missing value", { status: 400 });
    }

    const stmt = await db.prepare("UPDATE site_content SET content_value = ?, last_updated = unixepoch() WHERE id = ?").bind(content_value, id);
    await stmt.run();

    return new Response("Content updated successfully", { status: 200 });
}

// DELETE /api/admin/content/:id - 删除内容
export async function onRequestDelete(context) {
    const { env, params } = context;
    const db = env.DB;
    const id = params.id;

    const stmt = await db.prepare("DELETE FROM site_content WHERE id = ?").bind(id);
    await stmt.run();

    return new Response("Content deleted successfully", { status: 200 });
}
