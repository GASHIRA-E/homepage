/**
 * wifi接続時のみtrue
 * PC/非対応ブラウザはwifi接続でもfalse
 */
export default (): Boolean => {
  // ドラフト中の機能なので、any型を使用
  const navigator: any = window.navigator;
  return navigator.connection && navigator.connection.type === 'wifi';
};
