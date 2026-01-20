
export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response('File not found', { status: 400 });
        }
        
        const fileName = `${Date.now()}-${file.name}`;

        await env.BUCKET.put(fileName, await file.arrayBuffer(), {
            httpMetadata: {
                contentType: file.type,
            },
        });

        const publicUrl = `/api/images/${fileName}`;

        return new Response(JSON.stringify({ success: true, url: publicUrl }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response(`Upload failed: ${error.message}`, { status: 500 });
    }
}
