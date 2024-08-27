import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client'
import { createVoice } from '@/app/lib/voicevox';

const prisma = new PrismaClient();

// レコードとして登録はおこなうが、音声化はおこなわない。
export async function POST(request: NextRequest): NextResponse {
  const { content, title } = await request.json();

  try{
    await prisma.Voice.create({
      data: {
	title,
	content,
      }
    })
  }catch(e){
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Database Error"},
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

}
