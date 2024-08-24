import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest): NextResponse {
  const { text, } = await request.json();
  const fileName = uuidv4();

  const result = await processTextToVoice(text, fileName);
  if (!result.success) {
    return NextResponse.json(
      result,
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


async function processTextToVoice(text: string, filename: string, speakerId: number = 0) {
  try {
    // Voicevox APIに送るリクエストデータを作成
    const queryResponse = await fetch(`http://vv:50021/audio_query?speaker=${speakerId}&text=${text}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!queryResponse.ok) {
      console.error(queryResponse)
      throw new Error(`Failed to fetch audio query for text: ${text}`);
    }

    const queryJson = await queryResponse.json();

    // wavファイルを生成
    const synthesisResponse = await fetch(`http://vv:50021/synthesis?speaker=${speakerId}&enable_interrogative_upspeak=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryJson),
    });

    if (!synthesisResponse.ok) {
      throw new Error(`Failed to synthesize audio for text: ${text}`);
    }

    const audioBuffer = await synthesisResponse.arrayBuffer();

    // 音声ファイルを保存
    const voiceDir = path.join(process.cwd(), 'public', 'voice');
    if (!fs.existsSync(voiceDir)) {
      fs.mkdirSync(voiceDir, { recursive: true });
    }

    const wavFileName = `${filename}.wav`;
    const wavFilePath = path.join(voiceDir, wavFileName);
    fs.writeFileSync(wavFilePath, Buffer.from(audioBuffer));

    return { success: true, filePath: `/voice/${wavFileName}` };
  } catch (error) {
    console.error('Error processing text:', text, error.message);
    return { success: false, error: error.message };
  }
}
