"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<string[]>([]);
  // 登録処理などが発生したら再実行する
  const fetchWavFiles = async () => {
    const res = await fetch(`/api/voices`);
    if(res.ok) {
      const j = await res.json();
      setVoices(j);
    }else {
      alert('失敗');
    }
  }
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
  useEffect(() => {
    fetchWavFiles();
  }, [])
  return (
    <>
      <div>
        <textarea defaultValue={text} onChange={(e) => setText(e.target.value)}></textarea>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <ul>
	{voices.map((path, i) => (
	  <li key={i}>
	    <a href={`/voice/${path}`}>{path}</a>
	  </li>
	))}
      </ul>
    </>
  );
}
