import { NextResponse } from "next/server";
import {
  getLatestLeaderboardSnapshot,
  leaderboardSnapshotSchema,
  saveLeaderboardSnapshot,
} from "@/lib/leaderboard-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = leaderboardSnapshotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid leaderboard snapshot payload",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const snapshot = await saveLeaderboardSnapshot(parsed.data);

    return NextResponse.json(
      {
        ok: true,
        snapshot,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Leaderboard snapshot save error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to save leaderboard snapshot",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await getLatestLeaderboardSnapshot();
    return NextResponse.json({
      ok: true,
      snapshot,
    });
  } catch (error) {
    console.error("Leaderboard snapshot fetch error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to load leaderboard snapshot",
      },
      { status: 500 }
    );
  }
}
