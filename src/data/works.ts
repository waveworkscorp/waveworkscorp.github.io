export type Lang = 'ko' | 'en';
export type Category = 'game' | 'app' | 'web';
type Text = Record<Lang, string>;

export interface Work {
  slug: string;
  category: Category;
  name: Text;
  tagline: Text;
  about: Text;
  // 스토어 등록 문구에서 옮긴 핵심 기능
  features: readonly { title: Text; body: Text }[];
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

export const WORKS: readonly Work[] = data as readonly Work[];

export const worksBy = (category: Category) => WORKS.filter((w) => w.category === category);
