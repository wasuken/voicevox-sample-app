import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request: NextRequest): NextResponse {
  try {
    const records = await prisma.Voice.findMany({});
    // ファイル一覧を返す
    return NextResponse.json(records, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading files:', error.message);
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
