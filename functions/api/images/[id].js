
export async function onRequestGet(context) {
    try {
        const { request, env, params } = context;
        const { id } = params;

        const object = await env.BUCKET.get(id);

        if (object === null) {
            return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
            headers,
        });
    } catch (error) {
        console.error('Error retrieving image:', error);
        return new Response('Error retrieving image', { status: 500 });
    }
}
