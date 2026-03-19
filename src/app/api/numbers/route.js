import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  try {
    await initSheets();
    const sheet = await getSheetByName("Booked Numbers");
    const rows = await sheet.getRows();
    
    const now = new Date();
    const bookedNumbers = rows
      .filter((row) => {
        if (row.get("category") !== category) return false;
        
        const status = row.get("status");
        if (status === "BOOKED") return true;
        
        if (status === "HELD") {
          const expiresAt = new Date(row.get("expires_at"));
          return expiresAt > now;
        }
        
        return false;
      })
      .map((row) => String(row.get("car_number")));

    return NextResponse.json(
      { booked: bookedNumbers },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Fetch booked numbers error:", error);
    return NextResponse.json({ booked: [] }); // Fallback to empty if sheet not ready
  }
}
