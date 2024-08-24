import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): NextResponse {

  return NextResponse.json(
    {},
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
