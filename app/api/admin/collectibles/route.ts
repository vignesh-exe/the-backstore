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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadToCloudinary(file: File) {
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new Error("Collectibles Cloudinary server configuration is missing.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "the-backstore/collectibles";

  const signatureBase = `folder=${folder}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(signatureBase + cloudinaryApiSecret)
    .digest("hex");

  const cloudinaryFormData = new FormData();

  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("api_key", cloudinaryApiKey);
  cloudinaryFormData.append("timestamp", String(timestamp));
  cloudinaryFormData.append("folder", folder);
  cloudinaryFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    console.error("Collectible Cloudinary upload failed:", result);

    throw new Error(
      result.error?.message ||
        "Failed to upload collectible image to Cloudinary.",
    );
  }

  return {
    image_url: result.secure_url as string,
    cloudinary_public_id: (result.public_id as string) || null,
  };
}

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    const { data: collectibles, error: collectiblesError } = await supabaseAdmin
      .from("collectibles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (collectiblesError) {
      console.error("Failed to fetch collectibles:", collectiblesError);

      return jsonError(
        collectiblesError.message || "Unable to load collectibles.",
        500,
      );
    }

    const collectibleRows = collectibles ?? [];

    const collectibleIds = collectibleRows
      .map((collectible) => collectible.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    let collectibleImages: Array<{
      id: string;
      collectible_id: string;
      image_url: string;
      cloudinary_public_id: string | null;
      alt_text: string | null;
      sort_order: number;
      is_primary: boolean;
    }> = [];

    if (collectibleIds.length > 0) {
      const { data: images, error: imagesError } = await supabaseAdmin
        .from("collectible_images")
        .select(
          `
              id,
              collectible_id,
              image_url,
              cloudinary_public_id,
              alt_text,
              sort_order,
              is_primary
            `,
        )
        .in("collectible_id", collectibleIds)
        .order("sort_order", {
          ascending: true,
        });

      if (imagesError) {
        console.warn("Unable to load collectible images:", imagesError);
      } else {
        collectibleImages = images ?? [];
      }
    }

    const imagesMap = new Map<string, typeof collectibleImages>();

    for (const image of collectibleImages) {
      const existing = imagesMap.get(image.collectible_id) ?? [];

      existing.push(image);
      imagesMap.set(image.collectible_id, existing);
    }

    const mappedCollectibles = collectibleRows.map((collectible) => ({
      ...collectible,
      collectible_images: imagesMap.get(collectible.id) ?? [],
    }));

    return NextResponse.json({
      success: true,
      collectibles: mappedCollectibles,
    });
  } catch (error) {
    console.error("GET /api/admin/collectibles failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to load collectibles.",
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return jsonError("Invalid form data.");
    }

    const name = String(formData.get("name") ?? "").trim();

    const description = String(formData.get("description") ?? "").trim();

    const brand = String(formData.get("brand") ?? "").trim();

    const collection = String(formData.get("collection") ?? "").trim();

    const category = String(formData.get("category") ?? "").trim();

    const sku = String(formData.get("sku") ?? "").trim();

    const price = Number(formData.get("price") ?? 0);

    const mrp = Number(formData.get("mrp") ?? 0);

    const stock = Number(formData.get("stock") ?? 0);

    const statusValue = String(formData.get("status") ?? "Active").trim();

    const featured = String(formData.get("featured") ?? "false") === "true";

    const tagsValue = String(formData.get("tags") ?? "").trim();

    if (!name) {
      return jsonError("Collectible name is required.");
    }

    if (!sku) {
      return jsonError("SKU is required.");
    }

    if (!collection) {
      return jsonError("Collection is required.");
    }

    if (!category) {
      return jsonError("Category is required.");
    }

    if (!Number.isFinite(price) || price < 0) {
      return jsonError("Please enter a valid selling price.");
    }

    if (!Number.isFinite(mrp) || mrp < 0) {
      return jsonError("Please enter a valid MRP.");
    }

    if (price > mrp) {
      return jsonError("Selling price cannot be greater than MRP.");
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return jsonError("Please enter a valid stock quantity.");
    }

    const normalizedStatus =
      statusValue === "Inactive"
        ? "Inactive"
        : stock === 0
          ? "Out of Stock"
          : "Active";

    const tags = tagsValue
      ? tagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const baseSlug = createSlug(name);

    let slug = baseSlug;
    let slugCounter = 1;

    while (true) {
      const { data: existingSlug } = await supabaseAdmin
        .from("collectibles")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (!existingSlug) {
        break;
      }

      slugCounter += 1;
      slug = `${baseSlug}-${slugCounter}`;
    }

    const { data: existingSku } = await supabaseAdmin
      .from("collectibles")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (existingSku) {
      return jsonError("A collectible with this SKU already exists.");
    }

    const { data: insertedCollectible, error: insertError } =
      await supabaseAdmin
        .from("collectibles")
        .insert({
          name,
          slug,
          description: description || null,
          brand: brand || null,
          collection,
          category,
          sku,
          price,
          mrp,
          stock: Math.floor(stock),
          status: normalizedStatus,
          featured,
          tags,
        })
        .select("*")
        .single();

    if (insertError || !insertedCollectible) {
      console.error("Failed to create collectible:", insertError);

      return jsonError(
        insertError?.message || "Unable to create collectible.",
        500,
      );
    }

    const imageEntries = formData
      .getAll("images")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );

    const imageRows: Array<{
      collectible_id: string;
      image_url: string;
      cloudinary_public_id: string | null;
      alt_text: string;
      sort_order: number;
      is_primary: boolean;
    }> = [];

    try {
      for (let index = 0; index < imageEntries.length; index += 1) {
        const file = imageEntries[index];

        const uploaded = await uploadToCloudinary(file);

        imageRows.push({
          collectible_id: insertedCollectible.id,
          image_url: uploaded.image_url,
          cloudinary_public_id: uploaded.cloudinary_public_id,
          alt_text: name,
          sort_order: index,
          is_primary: index === 0,
        });
      }
    } catch (uploadError) {
      console.error("Collectible image upload failed:", uploadError);

      await supabaseAdmin
        .from("collectibles")
        .delete()
        .eq("id", insertedCollectible.id);

      return jsonError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload collectible images.",
        500,
      );
    }

    if (imageRows.length > 0) {
      const { data: insertedImages, error: imagesError } = await supabaseAdmin
        .from("collectible_images")
        .insert(imageRows)
        .select(
          `
            id,
            collectible_id,
            image_url,
            cloudinary_public_id,
            alt_text,
            sort_order,
            is_primary
          `,
        )
        .order("sort_order", {
          ascending: true,
        });

      if (imagesError) {
        console.error("Failed to save collectible images:", imagesError);

        await supabaseAdmin
          .from("collectibles")
          .delete()
          .eq("id", insertedCollectible.id);

        return jsonError(
          imagesError.message || "Unable to save collectible images.",
          500,
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Collectible created successfully.",
          collectible: {
            ...insertedCollectible,
            collectible_images: insertedImages ?? [],
          },
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Collectible created successfully.",
        collectible: {
          ...insertedCollectible,
          collectible_images: [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/collectibles failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to create collectible.",
      500,
    );
  }
}
