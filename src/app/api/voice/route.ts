import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client'
import { createVoice } from '@/app/lib/voicevox';

const prisma = new PrismaClient();

export async function POST(request: NextRequest): NextResponse {
  const { content, title } = await request.json();
  const fileName = uuidv4();

  const result = await processContentToVoice(content, fileName);
  if (!result.success) {
    return NextResponse.json(
      result,
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  try{
    await prisma.Voice.create({
      data: {
	title,
	content,
	path: result.filePath,
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
    result,
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

}


async function processContentToVoice(content: string, filename: string, speakerId: number = 0) {
  try {

    const voiceDir = path.join(process.cwd(), 'public', 'voice');
    if (!fs.existsSync(voiceDir)) {
      fs.mkdirSync(voiceDir, { recursive: true });
    }

    const wavFileName = `${filename}.wav`;
    const wavFilePath = path.join(voiceDir, wavFileName);
    const res = await createVoice(content, wavFilePath);
    if(!res){
      return { success: false, error: 'create voice error.' };
    }

    return { success: true, filePath: wavFilePath };
  } catch (error) {
    console.error('Error processing content:', content, error.message);
    return { success: false, error: error.message };
  }
}
