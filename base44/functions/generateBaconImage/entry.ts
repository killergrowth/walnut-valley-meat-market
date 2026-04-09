import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const result = await base44.asServiceRole.integrations.Core.GenerateImage({
            prompt: "Professional food photography of sliced bacon strips and a whole bacon slab on a pure white background, studio lighting, no watermarks, no text, no logos, clean product shot, high quality, appetizing",
            existing_image_urls: ["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/6bca6dcfe_image3.png"]
        });

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});