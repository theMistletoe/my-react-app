// 共有ターゲットからのPOSTリクエストをインターセプトするService Worker

// POSTデータを処理するための関数
async function processPostData(formData) {
  try {
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    const files = formData.getAll('files');
    
    // 単純化のため、localStorageを使用（実際のアプリではIndexedDBが推奨）
    const sharedData = {
      title,
      text,
      url,
      // File objectはJSONに直接保存できないため、ファイル情報のみを保存
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      }))
    };
    
    // データをWeb Workerの外側に送信
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SHARE_TARGET_DATA',
          data: sharedData
        });
      });
    });
    
    return sharedData;
  } catch (error) {
    console.error('共有データの処理中にエラーが発生しました:', error);
    return null;
  }
}

// Service Workerのイベントリスナー
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 共有ターゲットからのPOSTリクエストを処理
  if (event.request.method === 'POST' && url.pathname === '/share-target') {
    // レスポンスをクライアントに返す前にフォームデータを処理
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const data = await processPostData(formData);
        
        // 処理後、ShareTargetページにリダイレクト
        return Response.redirect('/share-target', 303);
      })()
    );
  }
});