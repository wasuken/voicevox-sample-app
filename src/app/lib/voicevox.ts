import fs from "fs";
import fetch from "node-fetch";
import { concatenateAudioBuffers } from "./wav";
import { promisify } from "util";

export function genUUID() {
  return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
    let r = (new Date().getTime() + Math.random() * 16) % 16 | 0,
      v = a == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function wavToArrayBuffer(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  return arrayBuffer;
}
export async function createVoice(text: string, wav_path: string) {
  if (text.length < 200) {
    return createShortVoice(text, wav_path);
  }
  return createVoiceFromLongString(text, wav_path);
}

async function createVoiceFromLongString(text: string, wav_path: string): string|null {
  let chunkSize = 200;
  let chunks = [];
  for (let i = 0, len = text.length; i < len; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  let pathList = [];
  let ab = null;
  for (let i = 0; i < chunks.length; i++) {
    const t = chunks[i];
    const fpath = await createShortVoice(t);
    pathList.push(fpath);
    if (ab) {
      ab = concatenateAudioBuffers(ab, wavToArrayBuffer(fpath));
    } else {
      ab = wavToArrayBuffer(fpath);
    }
  }
  if (ab) {
    const wavPath = writeWavFile(ab, wav_path);
    return wavPath;
  }
  return null;
}

// wavファイルを書き込む関数
function writeWavFile(arrayBuffer: ArrayBuffer, wpath?: string) {
  let filepath = "";
  if (wpath) {
    filepath = wpath;
  } else {
    const voice_id = genUUID();
    filepath = `/app/data/wav/${voice_id}.wav`;
  }
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filepath, buffer);
  return filepath;
}

async function createShortVoice(text: string, wpath?: string) {
  const res = await fetch(
    `http://vv:50021/audio_query?text=${text}&speaker=0`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const query = await res.json();

  const sound_row = await fetch(
    `http://vv:50021/synthesis?speaker=0&enable_interrogative_upspeak=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "audio/wav",
        responseType: "stream",
      },
      body: JSON.stringify(query),
    }
  );

  let filepath = "";
  if (wpath) {
    filepath = wpath;
  } else {
    const voice_id = genUUID();
    filepath = `/tmp/${voice_id}.wav`;
  }
  await download(sound_row, filepath);
  return filepath;
}

const finished = promisify(require("stream").finished);

async function download(response: Response, dest: string): Promise<void> {
  const destStream = fs.createWriteStream(dest);
  await new Promise<void>((resolve, reject) => {
    if (response.body) {
      response.body.pipe(destStream);
      destStream.on("close", resolve);
      destStream.on("error", reject);
    }
  });
  await finished(destStream);
}
