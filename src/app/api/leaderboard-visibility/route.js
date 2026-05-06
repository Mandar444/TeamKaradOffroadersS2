import { mkdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VISIBILITY_DIR = path.join(process.cwd(), "public", "data");
const VISIBILITY_FILE = path.join(VISIBILITY_DIR, "leaderboard-visibility.json");
const FALLBACK_VISIBILITY_DIR = path.join(os.tmpdir(), "team-karad-offroaders");
const FALLBACK_VISIBILITY_FILE = path.join(FALLBACK_VISIBILITY_DIR, "leaderboard-visibility.json");

const noStoreHeaders = {
  "Cache-Control": "no-store",
};

async function readVisibility() {
  for (const filePath of [VISIBILITY_FILE, FALLBACK_VISIBILITY_FILE]) {
    try {
      const raw = await readFile(filePath, "utf8");
      const data = JSON.parse(raw);

      return {
        visible: data?.visible !== false,
        updatedAt: data?.updatedAt || null,
      };
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return {
    visible: true,
    updatedAt: null,
  };
}

async function writeVisibility(visible) {
  const payload = {
    visible,
    updatedAt: new Date().toISOString(),
  };

  try {
    await mkdir(VISIBILITY_DIR, { recursive: true });
    await writeFile(VISIBILITY_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("[LEADERBOARD] Visibility public cache failed:", error?.message || error);
    await mkdir(FALLBACK_VISIBILITY_DIR, { recursive: true });
    await writeFile(FALLBACK_VISIBILITY_FILE, JSON.stringify(payload, null, 2), "utf8");
  }

  return payload;
}

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

export async function GET() {
  try {
    const visibility = await readVisibility();
    return NextResponse.json(visibility, { headers: noStoreHeaders });
  } catch (error) {
    return NextResponse.json(
      { visible: true, error: error?.message || "Unable to read leaderboard visibility" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

export async function POST(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders });
  }

  try {
    const body = await request.json();
    const visibility = await writeVisibility(body?.visible !== false);

    return NextResponse.json(visibility, { headers: noStoreHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unable to update leaderboard visibility" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
