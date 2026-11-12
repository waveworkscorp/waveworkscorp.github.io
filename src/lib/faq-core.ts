// 작품 페이지 '자주 묻는 질문'을 만드는 순수 함수. astro 없이 node --test로 검사한다
// 문답은 앱 원본(site.json)의 faq를 먼저, 이어서 info 줄을 아래 질문표로 바꾼 것을 둔다

type FaqLang = 'ko' | 'en';
export type FaqText = Record<FaqLang, string>;

export interface FaqSource {
  name: FaqText;
  faq?: readonly { q: FaqText; a: FaqText }[];
  info?: readonly { rows: readonly { label: FaqText; value: FaqText }[] }[];
}

export interface FaqEntry { q: string; a: string }

type Question = Record<FaqLang, (name: string) => string>;

// 키는 info 줄의 한국어 라벨. 이름 뒤 조사가 받침에 따라 바뀌지 않도록 '의·에·에서'만 쓴다
export const INFO_QUESTIONS: Readonly<Record<string, Question>> = {
  '지원 기기': { ko: (n) => `${n}의 지원 기기는 무엇인가요?`, en: (n) => `Which devices does ${n} run on?` },
  '연령 등급': { ko: (n) => `${n}의 연령 등급은 어떻게 되나요?`, en: (n) => `What is the age rating of ${n}?` },
  '광고': { ko: (n) => `${n}에 광고가 있나요?`, en: (n) => `Does ${n} have ads?` },
  '앱 내 구매': { ko: (n) => `${n}에 앱 내 구매가 있나요?`, en: (n) => `Does ${n} have in-app purchases?` },
  '인터넷 연결': { ko: (n) => `${n}에는 인터넷 연결이 필요한가요?`, en: (n) => `Does ${n} need an internet connection?` },
  '지원 언어': { ko: (n) => `${n}에서 지원하는 언어는 무엇인가요?`, en: (n) => `Which languages does ${n} support?` },
  '대상': { ko: (n) => `${n}의 이용 대상은 누구인가요?`, en: (n) => `Who is ${n} for?` },
  '저장 위치': { ko: (n) => `${n}의 기록은 어디에 저장되나요?`, en: (n) => `Where does ${n} store my records?` },
  '공유 범위': { ko: (n) => `${n}에서 기록은 누구와 어디까지 공유되나요?`, en: (n) => `Who can see my records in ${n}?` },
  '삭제 방법': { ko: (n) => `${n}의 데이터는 어떻게 삭제하나요?`, en: (n) => `How do I delete my data from ${n}?` },
};

export function buildFaq(work: FaqSource, lang: FaqLang): { entries: FaqEntry[]; unknownLabels: string[] } {
  const name = work.name[lang];
  const authored = (work.faq ?? []).map((item) => ({ q: item.q[lang], a: item.a[lang] }));
  const rows = (work.info ?? []).flatMap((box) => box.rows);
  const derived = rows.flatMap((row) => {
    const question = INFO_QUESTIONS[row.label.ko];
    return question ? [{ q: question[lang](name), a: row.value[lang] }] : [];
  });
  const unknownLabels = rows.map((row) => row.label.ko).filter((label) => !INFO_QUESTIONS[label]);
  return { entries: [...authored, ...derived], unknownLabels };
}
