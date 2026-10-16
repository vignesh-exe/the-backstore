import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cloudinaryCloudName = process.env.CLOUDINARY_COLLECTIBLES_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_COLLECTIBLES_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_COLLECTIBLES_API_SECRET;
const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;
function jsonError(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}
async function deleteFromCloudinary(publicId: string) {
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new Error("Collectibles Cloudinary server configuration is missing.");
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase + cloudinaryApiSecret)
    .digest("hex");
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", cloudinaryApiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok || !["ok", "not found"].includes(result?.result)) {
    console.error(
      "Failed to delete collectible image from Cloudinary:",
      result,
    );
    throw new Error(
      result?.error?.message ||
        "Failed to delete collectible image from Cloudinary.",
    );
  }
}
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }
    const { id } = await context.params;
    if (!id) {
      return jsonError("Collectible ID is required.");
    }
    const { data: collectible, error: collectibleError } = await supabaseAdmin
      .from("collectibles")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();
    if (collectibleError) {
      console.error(
        "Failed to find collectible for deletion:",
        collectibleError,
      );
      return jsonError(
        collectibleError.message || "Unable to find collectible.",
        500,
      );
    }
    if (!collectible) {
      return jsonError("Collectible not found.", 404);
    }
    const { data: images, error: imagesError } = await supabaseAdmin
      .from("collectible_images")
      .select("id, cloudinary_public_id")
      .eq("collectible_id", id);
    if (imagesError) {
      console.error(
        "Failed to load collectible images for deletion:",
        imagesError,
      );
      return jsonError(
        imagesError.message || "Unable to load collectible images.",
        500,
      );
    }
    for (const image of images ?? []) {
      if (image.cloudinary_public_id) {
        await deleteFromCloudinary(image.cloudinary_public_id);
      }
    }
    const { error: deleteError } = await supabaseAdmin
      .from("collectibles")
      .delete()
      .eq("id", id);
    if (deleteError) {
      console.error("Failed to delete collectible:", deleteError);
      return jsonError(
        deleteError.message || "Unable to delete collectible.",
        500,
      );
    }
    return NextResponse.json({
      success: true,
      message: "Collectible deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/collectibles/[id] failed:", error);
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete collectible.",
      500,
    );
  }
}
