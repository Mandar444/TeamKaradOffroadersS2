import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");

const createEmptySnapshot = () => ({
  generatedAt: null,
  source: "tko-app-reset",
  schemaVersion: 1,
  teams: [],
  results: [],
  disputes: [],
  categoryOptions: [],
  leaderboard: {
    categories: [],
  },
});

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

async function saveLocalSnapshot(snapshot) {
  await mkdir(LOCAL_EXPORT_DIR, { recursive: true });
  const payload = JSON.stringify(snapshot, null, 2);
  await writeFile(LOCAL_EXPORT_FILE, payload, "utf8");
  await writeFile(LOCAL_ROOT_EXPORT_FILE, payload, "utf8");
}

async function readLocalSnapshot() {
  for (const filePath of [LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE]) {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw new Error("Leaderboard export file not found locally");
}

export async function POST(request) {
  try {
    const snapshot = await request.json();

    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
      return NextResponse.json(
        { ok: false, error: "Invalid leaderboard payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    await saveLocalSnapshot(snapshot);

    return NextResponse.json(
      {
        ok: true,
        savedTo: "/leaderboard-export.json",
        generatedAt: snapshot?.generatedAt || null,
        cachedLocally: true,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to sync leaderboard export",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await readLocalSnapshot();

    return NextResponse.json(snapshot, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Leaderboard export file not found",
      },
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  }
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const snapshot = createEmptySnapshot();
    await saveLocalSnapshot(snapshot);

    return NextResponse.json(
      {
        ok: true,
        reset: true,
        savedTo: "/leaderboard-export.json",
        generatedAt: null,
        cachedLocally: true,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to reset leaderboard export",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
