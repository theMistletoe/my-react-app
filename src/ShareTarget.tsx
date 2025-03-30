import { useEffect, useState } from 'react'
import './App.css'
import './ShareTarget.css'

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

function ShareTarget() {
  const [sharedData, setSharedData] = useState<SharedData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // URLからパラメータを取得
      const params = new URLSearchParams(window.location.search);
      
      // リダイレクトループ防止: URLにパラメータがある場合は、パラメータを削除
      if (window.location.search) {
        // URLからパラメータを取得してからクリーンなURLに置き換える
        const title = params.get('title') || '';
        const text = params.get('text') || '';
        const url = params.get('url') || '';
        
        console.log('共有データを受信しました', { title, text, url });
        
        // データを保存
        setSharedData({ title, text, url });
        
        // デバッグ用にローカルストレージにも保存
        if (title || text || url) {
          localStorage.setItem('lastSharedData', JSON.stringify({ title, text, url }));
          
          // クリーンなURLに置き換え（リロードループを防止）
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({ sharedData: { title, text, url } }, '', cleanUrl);
        }
      } else {
        // URLパラメータがない場合は、履歴に保存されたstate（replaceStateで保存したデータ）を使用
        const state = window.history.state;
        if (state && state.sharedData) {
          setSharedData(state.sharedData);
          console.log('履歴から共有データを復元しました:', state.sharedData);
        } else {
          // ローカルストレージからデータを試行
          const savedData = localStorage.getItem('lastSharedData');
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setSharedData(parsedData);
              console.log('ローカルストレージから共有データを復元しました:', parsedData);
            } catch (e) {
              console.error('保存データの解析に失敗しました:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('共有データの処理中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="share-target-container loading">データを読み込み中...</div>;
  }

  // 共有データが空の場合
  const isEmpty = !sharedData.title && !sharedData.text && !sharedData.url;

  return (
    <div className="share-target-container">
      <h1>共有されたコンテンツ</h1>
      
      {isEmpty ? (
        <div className="shared-item empty">
          <p>共有データがありません。</p>
          <p>アプリを他のアプリから共有メニューで開いてください。</p>
        </div>
      ) : (
        <>
          {sharedData.title && (
            <div className="shared-item">
              <h2>タイトル:</h2>
              <p>{sharedData.title}</p>
            </div>
          )}
          
          {sharedData.text && (
            <div className="shared-item">
              <h2>テキスト:</h2>
              <p>{sharedData.text}</p>
            </div>
          )}
          
          {sharedData.url && (
            <div className="shared-item">
              <h2>URL:</h2>
              <p>
                <a href={sharedData.url} target="_blank" rel="noopener noreferrer">
                  {sharedData.url}
                </a>
              </p>
            </div>
          )}
        </>
      )}
      
      <button onClick={() => window.location.href = '/'}>
        ホームに戻る
      </button>
    </div>
  )
}

export default ShareTarget