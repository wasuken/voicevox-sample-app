"use client"
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  // 登録処理などが発生したら再実行する
  const fetchWavFiles = async () => { }
  const handleSubmit = async () => {
    const body = JSON.stringify({
      text
    })
    const res = await fetch(`/api/voice`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      alert('成功');
    } else {
      alert('失敗');
      console.error(res)
    }
  }
  return (
    <>
      <div>
        <textarea defaultValue={text} onChange={(e) => setText(e.target.value)}></textarea>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}
