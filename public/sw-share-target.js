// 共有ターゲットのService Worker（GETメソッド対応バージョン）

// ServiceWorkerのイベントリスナー
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 共有ターゲットからのリクエストを処理
  if (url.pathname === '/share-target' && url.search) {
    console.log('Service Worker: 共有データを受信しました:', url.search);
    
    // リロードループを防止するために、リクエストをインターセプト
    if (event.request.mode === 'navigate') {
      // クリーンなURLでリクエストをインターセプト
      const cleanUrl = url.origin + url.pathname;
      
      // パラメータからデータを抽出
      const params = new URLSearchParams(url.search);
      const data = {
        title: params.get('title') || '',
        text: params.get('text') || '',
        url: params.get('url') || ''
      };
      
      // データが存在する場合、クリーンなURLへのリクエストを作成
      if (data.title || data.text || data.url) {
        console.log('Service Worker: クリーンURLへリダイレクト:', cleanUrl);
        
        // Response オブジェクトをカスタマイズ
        const response = new Response(
          new Blob([
            `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>リダイレクト中...</title>
              <script>
                // データを履歴状態に保存
                const data = ${JSON.stringify(data)};
                window.history.replaceState({ sharedData: data }, '', '${cleanUrl}');
                // リロードせずに同じページに遷移
                window.location.replace('${cleanUrl}');
              </script>
            </head>
            <body>
              <p>リダイレクト中...</p>
            </body>
            </html>`
          ], { type: 'text/html' })
        );
        
        event.respondWith(response);
        return;
      }
    }
  }
});

// インストール時に必要なリソースをキャッシュ
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Share Target Service Worker installed');
});

// アクティベーション時の処理
self.addEventListener('activate', event => {
  console.log('Share Target Service Worker activated');
  return self.clients.claim();
});