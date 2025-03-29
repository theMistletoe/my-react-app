import { useEffect, useState } from 'react'
import './App.css'
import './ShareTarget.css'

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

function ShareTarget() {
  const [sharedData, setSharedData] = useState<SharedData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function processSharedData() {
      try {
        // POSTメソッドの場合はクエリパラメータがない
        if (window.location.search) {
          // フォールバック：GETメソッドで共有された場合
          const params = new URLSearchParams(window.location.search);
          const title = params.get('title') || '';
          const text = params.get('text') || '';
          const url = params.get('url') || '';
          
          setSharedData({ title, text, url });
          setIsLoading(false);
          return;
        }

        // POSTメソッドで共有された場合：IndexedDBからデータを取得
        const data = await getSharedDataFromStorage();
        
        if (data) {
          setSharedData(data);
        } else {
          // 保存されたデータがない場合は空のオブジェクトを設定
          console.warn('共有データが見つかりませんでした');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('共有データの処理中にエラーが発生しました:', error);
        setIsLoading(false);
      }
    }

    processSharedData();
  }, []);

  // IndexedDBから共有データを取得
  const getSharedDataFromStorage = async (): Promise<SharedData | null> => {
    // ローカルストレージから一時的に保存された共有データを取得
    const sharedDataStr = localStorage.getItem('sharedData');
    if (sharedDataStr) {
      // 使用後はクリア
      localStorage.removeItem('sharedData');
      return JSON.parse(sharedDataStr);
    }
    return null;
  };

  if (isLoading) {
    return <div className="share-target-container loading">データを読み込み中...</div>;
  }

  // 共有データが空の場合
  const isEmpty = !sharedData.title && !sharedData.text && !sharedData.url &&
                 (!sharedData.files || sharedData.files.length === 0);

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
          
          {sharedData.files && sharedData.files.length > 0 && (
            <div className="shared-item">
              <h2>ファイル ({sharedData.files.length}):</h2>
              <ul className="file-list">
                {sharedData.files.map((file, index) => (
                  <li key={index} className="file-item">
                    <div className="file-info">
                      <strong>{file.name}</strong> ({file.type || '不明なタイプ'}, {(file.size / 1024).toFixed(2)} KB)
                    </div>
                    {file.type.startsWith('image/') && (
                      <div className="file-preview">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview of ${file.name}`}
                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
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