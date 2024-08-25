import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest): NextResponse {
  try {
    const voiceDir = path.join(process.cwd(), 'public', 'voice');

    // ディレクトリが存在しない場合は空の配列を返す
    if (!fs.existsSync(voiceDir)) {
      return NextResponse.json([], {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ディレクトリ内のファイル一覧を取得
    const files = fs.readdirSync(voiceDir).filter(file => file.endsWith('.wav'));

    // ファイル一覧を返す
    return NextResponse.json(files, {
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
