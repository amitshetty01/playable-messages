import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/supabase";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
  "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm",
]);

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xFF, 0xD8, 0xFF])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4E, 0x47])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46])],
  "image/webp": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  "video/mp4": [new Uint8Array([0x00, 0x00, 0x00]), new Uint8Array([0x66, 0x74, 0x79, 0x70])],
  "video/webm": [new Uint8Array([0x1A, 0x45, 0xDF, 0xA3])],
  "video/quicktime": [new Uint8Array([0x00, 0x00, 0x00]), new Uint8Array([0x66, 0x74, 0x79, 0x70])],
  "audio/mpeg": [new Uint8Array([0xFF, 0xFB]), new Uint8Array([0xFF, 0xF3]), new Uint8Array([0xFF, 0xF2])],
  "audio/ogg": [new Uint8Array([0x4F, 0x67, 0x67, 0x53])],
  "audio/wav": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  "audio/webm": [new Uint8Array([0x1A, 0x45, 0xDF, 0xA3])],
};

function validateMagicBytes(buffer: Buffer, mime: string): boolean {
  const signatures = MAGIC_BYTES[mime];
  if (!signatures) return false;
  return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "File upload requires Supabase configuration" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const roomId = formData.get("roomId") as string | null;

  if (!file || !roomId) {
    return NextResponse.json({ error: "file and roomId are required" }, { status: 400 });
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Maximum 50MB." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: `File type "${file.type}" is not allowed. Allowed: ${[...ALLOWED_TYPES].join(", ")}` }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const supabase = getSupabaseServerClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!validateMagicBytes(buffer, file.type)) {
    return NextResponse.json({ error: "File content does not match its declared type" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const fileType = isImage ? "image" : isVideo ? "video" : "file";
  const fileName = `${roomId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("chat-files")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    if (uploadError.message?.includes("bucket") || uploadError.message?.includes("not found")) {
      const { error: bucketError } = await supabase.storage.createBucket("chat-files", {
        public: true, fileSizeLimit: 52428800,
      });
      if (bucketError) return NextResponse.json({ error: bucketError.message }, { status: 500 });

      const { data: retryData, error: retryError } = await supabase.storage
        .from("chat-files")
        .upload(fileName, buffer, { contentType: file.type, upsert: false });
      if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 });

      const { data: { publicUrl } } = supabase.storage.from("chat-files").getPublicUrl(retryData.path);
      return NextResponse.json({ url: publicUrl, name: file.name, size: file.size, type: fileType });
    }
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from("chat-files").getPublicUrl(uploadData.path);
  return NextResponse.json({ url: publicUrl, name: file.name, size: file.size, type: fileType });
}
