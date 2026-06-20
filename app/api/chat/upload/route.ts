import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/supabase";

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

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isVideo = ["mp4", "webm", "mov"].includes(ext);
  const fileType = isImage ? "image" : isVideo ? "video" : "file";

  const supabase = getSupabaseServerClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${roomId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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
