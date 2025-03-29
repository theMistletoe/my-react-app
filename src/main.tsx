import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ShareTarget from './ShareTarget.tsx'

// Service Workerの登録
if ('serviceWorker' in navigator) {
  // メインのService Worker
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Main Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Main Service Worker registration failed:', error);
    });
    
  // 共有ターゲット用のService Worker
  navigator.serviceWorker.register('/sw-share-target.js')
    .then(registration => {
      console.log('Share Target Service Worker registered with scope:', registration.scope);
      
      // Service Workerからのメッセージを処理
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SHARE_TARGET_DATA') {
          // 共有データを一時的にlocalStorageに保存
          localStorage.setItem('sharedData', JSON.stringify(event.data.data));
          console.log('共有データを受信しました:', event.data.data);
        }
      });
    })
    .catch(error => {
      console.error('Share Target Service Worker registration failed:', error);
    });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/share-target" element={<ShareTarget />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
