
export async function onRequest(context) {
  const { env } = context;
  const db = env.DB;

  try {
    const stmt = await db.prepare("SELECT content_key, content_value FROM site_content");
    const { results } = await stmt.all();

    // Convert the array of objects into a single object for easier lookup on the client-side
    const content = results.reduce((obj, item) => {
      obj[item.content_key] = item.content_value;
      return obj;
    }, {});

    return new Response(JSON.stringify(content), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
