---
name: file-upload-handling
description: File upload patterns. Direct upload, presigned URLs, S3, Cloudinary, validation, chunked upload, progress.
---

# File Upload Handling

> Never proxy large files through your API. Upload directly to storage.

---

## 1. Upload Strategies

| Strategy | Description | When |
|----------|-------------|------|
| **Direct to server** | API receives file | Small files (< 10MB), simple |
| **Presigned URL** | Client uploads to S3/GCS directly | Large files, scalable |
| **Chunked upload** | Split into parts | Very large files (> 100MB) |
| **tus protocol** | Resumable uploads | Unreliable connections |

---

## 2. Presigned URL Flow (S3)

```
Client                  Server              AWS S3
  │                        │                   │
  ├── POST /upload/sign ──→ │                   │
  │   { filename, type }    ├── getSignedUrl ──→ │
  │                        │ ←── presigned URL ──┤
  │ ←── { uploadUrl, key } ┤                   │
  │                        │                   │
  ├──────────── PUT {uploadUrl} ───────────────→ │
  │ (binary, no server involved)                │
  │                        │                   │
  ├── POST /upload/confirm ─→                  │
  │   { key }               │                   │
```

```ts
// Server: generate presigned URL
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

app.post("/upload/sign", auth, async (req, res) => {
  const { filename, contentType, size } = req.body;

  // Validate before signing
  if (size > 10 * 1024 * 1024) throw new Error("File too large");
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(contentType)) throw new Error("File type not allowed");

  const key = `uploads/${req.user.id}/${randomUUID()}-${filename}`;

  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  }), { expiresIn: 300 }); // 5 min

  res.json({ uploadUrl: url, key });
});
```

---

## 3. Client Upload with Progress

```tsx
async function uploadFile(file: File) {
  // 1. Get presigned URL
  const { uploadUrl, key } = await fetch("/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  }).then(r => r.json());

  // 2. Upload with progress (XMLHttpRequest for progress events)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round(e.loaded / e.total * 100));
      }
    });
    xhr.addEventListener("load", () => xhr.status < 400 ? resolve() : reject());
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });

  return key;
}
```

---

## 4. Validation Rules

```ts
// Server-side validation (always, even with presigned URLs)
const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  document: ["application/pdf", "application/msword"],
  video: ["video/mp4", "video/webm"],
};

const MAX_SIZES = {
  image: 5 * 1024 * 1024,     // 5MB
  document: 25 * 1024 * 1024, // 25MB
  video: 500 * 1024 * 1024,   // 500MB
};

// Validate MIME type from magic bytes, not just extension/Content-Type header
import { fileTypeFromBuffer } from "file-type";

const buffer = await file.arrayBuffer();
const detectedType = await fileTypeFromBuffer(new Uint8Array(buffer));
if (!detectedType || !allowed.includes(detectedType.mime)) {
  throw new Error("Invalid file type");
}
```

---

## 5. Image Processing (Cloudinary)

```ts
import { v2 as cloudinary } from "cloudinary";

// Upload + transform
const result = await cloudinary.uploader.upload(filePath, {
  folder: "avatars",
  transformation: [
    { width: 400, height: 400, crop: "fill", gravity: "face" },
    { quality: "auto", fetch_format: "auto" },
  ],
  eager: [
    { width: 100, height: 100, crop: "fill" }, // thumbnail
    { width: 200, height: 200, crop: "fill" }, // medium
  ],
});

// Dynamic URL transforms
const optimizedUrl = cloudinary.url(result.public_id, {
  width: 800, crop: "scale",
  quality: "auto", fetch_format: "auto",
});
```

---

## 6. Post-Upload Processing

```ts
// Queue processing after upload
await imageQueue.add("process-avatar", {
  key: s3Key,
  userId: req.user.id,
}, { attempts: 3 });

// Worker
worker.process(async (job) => {
  const { key, userId } = job.data;
  // Download from S3, process, re-upload, update DB
  const buffer = await downloadFromS3(key);
  const processed = await sharp(buffer).resize(400, 400).toBuffer();
  const finalKey = await uploadToS3(processed, `avatars/${userId}.webp`);
  await db.user.update({ where: { id: userId }, data: { avatarUrl: finalKey } });
});
```

---

## 7. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Trust Content-Type header | Validate magic bytes |
| Proxy files through API | Presigned URLs for S3 |
| Store files in DB | Use object storage |
| Serve user files from app | Use CDN |
| Accept any file type | Explicit allowlist |
| Synchronous processing | Queue post-processing |
