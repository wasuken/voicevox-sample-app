import wav from "wav";
import fs from "fs";
export function concatenateAudioBuffers(
  buffer1: ArrayBuffer,
  buffer2: ArrayBuffer
): ArrayBuffer {
  const headerSize = 44; // WAVファイルのヘッダーサイズ

  // ArrayBufferからDataViewを作成
  const view1 = new DataView(buffer1);
  const view2 = new DataView(buffer2);

  // 各ファイルのデータサイズを取得
  const dataSize1 = view1.getUint32(40, true);
  const dataSize2 = view2.getUint32(40, true);

  // 新しいWAVファイルのデータサイズを計算
  const newDataSize = dataSize1 + dataSize2;

  // 新しいWAVファイルのArrayBufferを作成
  const newBuffer = new ArrayBuffer(headerSize + newDataSize);

  // 新しいWAVファイルのDataViewを作成
  const newView = new DataView(newBuffer);

  // ヘッダー情報を新しいWAVファイルにコピー
  for (let i = 0; i < headerSize; i++) {
    newView.setUint8(i, view1.getUint8(i));
  }

  // 新しいデータサイズをヘッダーに設定
  newView.setUint32(40, newDataSize, true);

  // 音声データを新しいWAVファイルにコピー
  for (let i = 0; i < dataSize1; i++) {
    newView.setUint8(headerSize + i, view1.getUint8(headerSize + i));
  }
  for (let i = 0; i < dataSize2; i++) {
    newView.setUint8(
      headerSize + dataSize1 + i,
      view2.getUint8(headerSize + i)
    );
  }

  return newBuffer;
}
