import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.515.0";

const R2_ACCOUNT_ID = Deno.env.get("R2_ACCOUNT_ID") || "18113006866e0a5d3dfc002d8d1fabab";
const R2_ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID") || "7883d5ec59ed83172ade90478cc1409b";
const R2_SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY") || "0c89f4bcbefbde8699b99caf71c1df25875bb44b56a802bbce5150ab6a38c724";
const R2_BUCKET_NAME = Deno.env.get("R2_BUCKET_NAME") || "kowy-frames";
const R2_PUBLIC_URL = (Deno.env.get("R2_PUBLIC_URL") || Deno.env.get("VITE_R2_CDN_URL") || "https://cdn.kowy.app").replace(/\/+$/, "");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { base64, fileData, filename, folder = "services", contentType = "image/webp" } = await req.json();
    const rawData = base64 || fileData;

    if (!rawData) {
      return new Response(JSON.stringify({ error: "Falta el contenido de la imagen (base64 o fileData)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanBase64 = String(rawData).replace(/^data:image\/[a-z0-9-+.]+;base64,/i, "").trim();
    const binaryData = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));

    const safeFolder = String(folder || "services").replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "services";
    const cleanName = String(filename || "service_image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();

    const extension = contentType.includes("png") ? "png" : contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "webp";
    const key = `${safeFolder}/${Date.now()}_${cleanName || "item"}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: binaryData,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    await s3.send(command);

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        key: key,
        bucket: R2_BUCKET_NAME,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error en r2-upload Edge Function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Error al procesar la subida a Cloudflare R2",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
