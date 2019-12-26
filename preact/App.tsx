import {FunctionalComponent, h} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

import Rotate from './three/rotate';
import ThreeScene from './three/scene';
import ThreeViewer from './three/viewer';

import isMobile from '@utils/isMobile';
import isConnectingWifi from '@utils/isConnectingWifi';

type ModelName = 'otohime' | 'curing' | '';

const App: FunctionalComponent = () => {
  // pc or smp(wifi) のみ初回読み込み実行で、それ以外はボタン押下しないとvrmを読み込まない
  // 通信容量削減のために
  const firstLoadModel: ModelName = !isMobile()
    ? 'otohime'
    : isConnectingWifi()
    ? 'otohime'
    : '';

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelType, setModelType] = useState<ModelName>(firstLoadModel);
  const [isRotate, setIsRotate] = useState(true);

  const divRef = useRef<HTMLDivElement>();
  const rotate = useRef(new Rotate()).current;
  const scene = useRef(
    new ThreeScene(() => {
      rotate.update(viewer.model);
    }),
  ).current;
  const viewer = useRef(new ThreeViewer(scene.scene)).current;

  useEffect(() => {
    scene.start(divRef.current!);
    onOtohime();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', scene.resize);
    return () => {
      window.removeEventListener('resize', scene.resize);
    };
  }, []);

  const onOtohime = async () => {
    if (loading) return;
    setModelType('otohime');
    setLoading(true);
    await viewer.loadVrm(setProgress);
    setLoading(false);
  };

  const onCuring = async () => {
    if (loading) return;
    setModelType('curing');
    setLoading(true);
    await viewer.loadFbx(setProgress);
    setLoading(false);
  };

  const toggleRotate = () => {
    rotate.switch();
    setIsRotate((prev) => !prev);
  };

  return (
    <div className="viewer">
      <div className="controller">
        <button
          onClick={onOtohime}
          className={modelType === 'otohime' ? 'active' : ''}>
          おとひめ
        </button>
        <button
          onClick={onCuring}
          className={modelType === 'curing' ? 'active' : ''}>
          うんちかーりんぐ
        </button>
      </div>

      {loading && <p>Now Loading {progress}%</p>}
      {modelType === 'otohime' && (
        <div className="description">
          <p>おとひめ.vrm</p>
          <a
            href="https://3d.nicovideo.jp/works/td41391"
            target="_blank"
            rel="noopener noreferrer">
            3d.nicovideo.jp/works/td41391
          </a>
        </div>
      )}

      {modelType === 'curing' && (
        <div className="description">
          <p>うんちカーリング</p>
          <a
            href="https://omesis-shop.booth.pm/items/1269953"
            target="_blank"
            rel="noopener noreferrer">
            omesis-shop.booth.pm/items/1269953
          </a>
        </div>
      )}

      <button
        onClick={toggleRotate}
        className={`rotate_button ${isRotate ? 'active' : ''}`}>
        <i className={`fas fa-fw fa-${isRotate ? 'times' : 'sync-alt'}`} />
        {isRotate ? '回転停止' : '回転開始'}
      </button>
      <div ref={divRef} />
    </div>
  );
};

export default App;
