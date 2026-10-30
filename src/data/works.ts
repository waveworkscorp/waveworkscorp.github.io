export type Lang = 'ko' | 'en';
export type Category = 'game' | 'app' | 'web';
type Text = Record<Lang, string>;
export interface InfoBox { title: Text; rows: readonly { label: Text; value: Text }[] }

export interface Work {
  slug: string;
  category: Category;
  name: Text;
  tagline: Text;
  about: Text;
  // 스토어 등록 문구에서 옮긴 핵심 기능
  features: readonly { title: Text; body: Text }[];
  // 소개 아래 짧은 규칙·사용 단계
  steps?: readonly Text[];
  // 스크린샷마다 화면에서 하는 일. 있으면 장수와 같다
  captions?: readonly Text[];
  // 첫 상자는 다운로드 전 확인 정보로 히어로 바로 아래, 나머지는 특징 뒤에 둔다
  info?: readonly InfoBox[];
  // public/works/<slug>/shots/<lang>-<n>.jpg 장수, 스크린샷이 없으면 0
  shots: number;
  icon: string;
  // 카드 바탕색, 작품 아이콘에서 뽑음
  accent: string;
  banner?: string;
  // 공개 앱은 sync 검사에서 처리방침이 필수라 항상 있다
  privacy: Text;
  terms?: Text;
  deletion?: Text;
  stores: { play?: string; appStore?: string };
}

// 앱마다 apps/<id>/site/에 둔 원본을 루트의 npm run site:sync가 works.json으로 만든다. 여기서 고치지 않는다
import data from './works.json';

export const isAvailable = (w: Work): boolean => Boolean(w.stores.play ?? w.stores.appStore);
export const platformsOf = (w: Work): readonly string[] => [...(w.stores.play ? ['Android'] : []), ...(w.stores.appStore ? ['iOS'] : [])];

// 설치하러 온 사람이 먼저 보도록 지금 받을 수 있는 작품을 앞에 둔다. 나머지는 원본 순서를 지킨다
export const WORKS: readonly Work[] = [...(data as readonly Work[])].sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));

export const worksBy = (category: Category) => WORKS.filter((w) => w.category === category);
