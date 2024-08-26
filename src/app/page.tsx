"use client"
import { useState, useEffect } from 'react';

interface Voice {
  id: number;
  title: string;
  content: string;
  path: string;
}

export default function Home() {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [voices, setVoices] = useState<Voice[]>([]);
  // 登録処理などが発生したら再実行する
  const fetchWavFiles = async () => {
    const res = await fetch(`/api/voices`);
    if(res.ok) {
      const j = await res.json();
      setVoices(j);
    }else {
      alert('fetch: failed');
    }
  }
  const handleSubmit = async () => {
    const body = JSON.stringify({
      title,
      content
    })
    const res = await fetch(`/api/voice`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      alert('post: success');
      setTitle('');
      setContent('');
      fetchWavFiles();
    } else {
      alert('post: failed');
      console.error(res)
    }
  }
  useEffect(() => {
    fetchWavFiles();
  }, [])
  return (
    <>
      <div>
	<input
	  type="text"
	  defaultValue={title}
	  value={title}
	  onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <textarea
	  defaultValue={content}
	  value={content}
	  onChange={(e) => setContent(e.target.value)}></textarea>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <ul>
	{voices.map((v, i) => (
	  <li key={i}>
	    <a href={v.path}>{v.title}</a>
	  </li>
	))}
      </ul>
    </>
  );
}
