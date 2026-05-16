import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  readLeaderboardVisibility,
  writeLeaderboardVisibility,
} from "@/lib/leaderboard-visibility-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

export async function GET() {
  try {
    const visibility = await readLeaderboardVisibility();
    return NextResponse.json(visibility, { headers: noStoreHeaders });
  } catch (error) {
    return NextResponse.json(
      { visible: false, error: error?.message || "Unable to read leaderboard visibility" },
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
    const visibility = await writeLeaderboardVisibility(body?.visible !== false);

    return NextResponse.json(visibility, { headers: noStoreHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unable to update leaderboard visibility" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
