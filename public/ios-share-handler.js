// iOS向け共有ハンドラー
(function() {
  // PWAインストール状態の確認
  function isPWAInstalled() {
    return window.navigator.standalone === true || 
           window.matchMedia('(display-mode: standalone)').matches;
  }

  // URLパラメータからシェアデータを抽出
  function getSharedDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      title: urlParams.get('title') || '',
      text: urlParams.get('text') || '',
      url: urlParams.get('url') || '',
    };
  }

  // シェアデータを保存
  function saveSharedData(data) {
    localStorage.setItem('sharedData', JSON.stringify(data));
    console.log('共有データを保存しました:', data);
  }

  // iOSの共有からアプリが起動された場合の処理
  function handleiOSShare() {
    // URLパラメータの処理
    const data = getSharedDataFromURL();
    
    // データがあれば保存
    if (data.title || data.text || data.url) {
      saveSharedData(data);
      
      // URLパラメータがある場合の処理
      if (window.location.search) {
        // シェアターゲットページでない場合はリダイレクト
        if (window.location.pathname !== '/share-target') {
          // パラメータなしでリダイレクト
          window.location.replace('/share-target');
          return;
        }
        
        // 既にシェアターゲットページにいる場合は、URLからパラメータを削除するだけ
        const cleanUrl = window.location.origin + window.location.pathname;
        history.replaceState(null, document.title, cleanUrl);
      }
    }
  }

  // DOMコンテンツ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    // PWAとしてインストールされている場合
    if (isPWAInstalled()) {
      console.log('PWAとして実行中です');
      handleiOSShare();
    } else {
      console.log('ブラウザで実行中です。PWAとしてインストールすると共有機能が使えます。');
    }
  });
})();