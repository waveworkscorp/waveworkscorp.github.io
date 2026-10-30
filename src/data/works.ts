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
  // public/img/shots/<slug>/<lang>-<n>.jpg 장수, 스크린샷이 없으면 0
  shots: number;
  icon: string;
  // 카드 바탕색, 작품 아이콘에서 뽑음
  accent: string;
  banner?: string;
  // 스토어에 이미 등록된 기존 주소라 바꾸지 않는다
  privacy: Text;
  terms?: Text;
  deletion?: Text;
  stores: { play?: string; appStore?: string };
}

export const WORKS: readonly Work[] = [
  {
    slug: 'bus-jam',
    category: 'game',
    name: { ko: '스쿨버스 지옥탈출', en: 'Bus Loop Escape' },
    tagline: { ko: '색을 맞춰 버스를 탈출시키는 퍼즐', en: 'Match colors and get every bus out' },
    about: {
      ko: '꽉 막힌 주차장에서 버스를 탭해 빼내고, 같은 색 승객을 태워 출발시키는 버스 탈출 퍼즐입니다. 레벨은 300개가 넘고 시간 제한이 없어 손가락 하나로 느긋하게 즐깁니다.',
      en: "A bus jam puzzle: tap buses out of a packed parking lot and seat passengers by color. Over 300 stages, no timer, and one finger is all it takes.",
    },
    features: [
      { title: { ko: '레벨 300개+', en: '300+ stages' }, body: { ko: '뒤로 갈수록 버스 색이 늘고 주차장이 복잡해집니다', en: 'Later stages add colors and trickier lots' } },
      { title: { ko: '5가지 배경', en: 'Five themes' }, body: { ko: '10레벨마다 공원, 광장, 해변, 놀이터, 눈 마을로 바뀝니다', en: 'The background changes every 10 stages' } },
      { title: { ko: '특수 버스', en: 'Special buses' }, body: { ko: '22레벨부터 가려진 버스와 컨테이너 버스가 나옵니다', en: 'Hidden and container buses appear from stage 22' } },
      { title: { ko: '부스터 4종', en: 'Four boosters' }, body: { ko: 'VIP, 정렬, 섞기, 주차 공간 열기', en: 'VIP, Sort, Shuffle and Open a Spot' } },
    ],
    shots: 4,
    icon: '/img/icon-busjam.png',
    accent: '#ffc21a',
    banner: '/img/fg-busjam.png',
    privacy: { ko: '/privacy/', en: '/en/privacy/' },
    terms: { ko: '/terms/', en: '/en/terms/' },
    stores: {},
  },
  {
    slug: 'unscrew',
    category: 'game',
    name: { ko: '스크류 펀치 3D', en: 'Screw Punch 3D' },
    tagline: { ko: '3D 모형을 돌려 나사를 푸는 퍼즐', en: 'Spin the model, pull the screws' },
    about: {
      ko: '3D 모형을 드래그로 돌리고 색 나사를 탭해 뽑습니다. 뽑은 나사는 같은 색 상자로 날아가고, 맞는 상자가 없으면 대기 구멍에 꽂힙니다. 나사를 모두 빼면 클리어, 대기 구멍이 다 차면 실패입니다.',
      en: "Rotate a 3D model with a drag and tap colored screws to pull them out. Each screw flies to the box of its color, or waits in a spare hole. Clear every screw to win; fill the last hole and the level fails.",
    },
    features: [
      { title: { ko: '모형 20개, 레벨 100개', en: '20 models, 100 levels' }, body: { ko: '집부터 모래성까지 하나씩 풀어 갑니다', en: 'From houses to sandcastles' } },
      { title: { ko: '부스터 3종', en: 'Three boosters' }, body: { ko: '드릴, 망치, 빗자루로 막힌 판을 엽니다', en: 'Drill, hammer and broom' } },
      { title: { ko: '진열장과 순위', en: 'Showcase and rankings' }, body: { ko: '푼 모형을 모으고 업적과 순위를 겨룹니다', en: 'Collect finished models and chase achievements' } },
      { title: { ko: '진행 백업', en: 'Progress backup' }, body: { ko: 'Game Center와 Google Play 게임으로 이어서 합니다', en: 'Game Center and Google Play Games' } },
    ],
    shots: 4,
    icon: '/img/icon-unscrew.png',
    accent: '#9b8cff',
    privacy: { ko: '/unscrew/privacy/', en: '/en/unscrew/privacy/' },
    terms: { ko: '/unscrew/terms/', en: '/en/unscrew/terms/' },
    deletion: { ko: '/unscrew/deletion/', en: '/en/unscrew/deletion/' },
    stores: {},
  },
  {
    slug: 'yokai-hunters',
    category: 'game',
    name: { ko: '요괴 사냥꾼', en: 'Yokai Hunters' },
    tagline: { ko: '오행 카드로 요괴를 막는 로그라이크 디펜스', en: 'Roguelike defense with five-element cards' },
    about: {
      ko: '한국 전래 요괴가 성벽으로 몰려오는 로그라이크 디펜스입니다. 영웅이 알아서 싸우고, 웨이브 사이에 뜨는 카드 3장 중 하나를 골라 부적을 얻거나 강화합니다. 한 판 4~7분, 웨이브 20개를 버티면 클리어입니다.',
      en: "A roguelike defense where yokai from Korean folklore storm your wall. Your hero fights on its own; between waves you pick one of three cards to gain or upgrade a talisman. A run takes 4 to 7 minutes, and 20 waves clears the stage.",
    },
    features: [
      { title: { ko: '오행 상생', en: 'Five elements' }, body: { ko: '목·화·토·금·수 순서로 고르면 추가 효과가 붙습니다', en: 'Follow the generating order for a bonus' } },
      { title: { ko: '다섯 영웅', en: 'Five heroes' }, body: { ko: '도사, 무녀, 승려, 화랑, 검무사', en: 'Sage, Shaman, Monk, Hwarang and Blade Dancer' } },
      { title: { ko: '소환수 5종', en: 'Five summons' }, body: { ko: '해태, 불가사리, 삼족오, 청룡, 기린', en: 'Haetae, Bulgasari, Samjogo, Azure Dragon and Girin' } },
      { title: { ko: '심연 모드', en: 'The Abyss' }, body: { ko: '스테이지 10을 깨면 열리고 층마다 요괴가 강해집니다', en: 'Opens after stage 10, with tougher foes each floor' } },
    ],
    shots: 4,
    icon: '/img/icon-yokai.png',
    accent: '#2b2f5e',
    banner: '/img/fg-yokai.png',
    privacy: { ko: '/yokai-hunters/privacy/', en: '/en/yokai-hunters/privacy/' },
    terms: { ko: '/yokai-hunters/terms/', en: '/en/yokai-hunters/terms/' },
    stores: {},
  },
  {
    slug: 'cheepdoku',
    category: 'game',
    name: { ko: '삐약도쿠', en: 'CheepDoku' },
    tagline: { ko: '병아리를 한 줄에 하나씩 놓는 논리 퍼즐', en: 'A chick logic puzzle, one per row' },
    about: {
      ko: '줄마다, 칸마다, 색 구역마다 병아리를 한 마리씩 놓는 논리 퍼즐입니다. 병아리끼리는 대각선으로도 닿으면 안 됩니다. 모든 판은 추측 없이 풀리고 답은 하나뿐이라, 1~5분이면 한 판이 끝납니다.',
      en: "Place one chick in every row, column and colored region, with no two touching, not even diagonally. Every board has exactly one solution and needs no guessing, so a round takes 1 to 5 minutes.",
    },
    features: [
      { title: { ko: '점점 커지는 판', en: 'Growing boards' }, body: { ko: '4×4부터 10×10까지 차근차근', en: 'From 4×4 up to 10×10' } },
      { title: { ko: '데일리 퍼즐', en: 'Daily puzzle' }, body: { ko: '매일 한 판, 3·5·7일째 선물', en: 'A new board each day, gifts on days 3, 5 and 7' } },
      { title: { ko: '친절한 튜토리얼', en: 'Friendly tutorial' }, body: { ko: '처음 하는 분도 대화로 배웁니다', en: 'Learn the rules step by step' } },
      { title: { ko: '힌트와 되돌리기', en: 'Hints and undo' }, body: { ko: '막히면 힌트, 실수하면 되돌리기', en: 'A hint when stuck, undo when you slip' } },
    ],
    shots: 3,
    icon: '/img/icon-cheepdoku.png',
    accent: '#ffe36b',
    privacy: { ko: '/privacy/', en: '/en/privacy/' },
    terms: { ko: '/terms/', en: '/en/terms/' },
    stores: {},
  },
  {
    slug: 'babylog',
    category: 'app',
    name: { ko: '오 마이 베이비', en: 'Oh My Baby' },
    tagline: { ko: '한 손으로 원탭 육아일지', en: 'One-tap baby log for one free hand' },
    about: {
      ko: '밤중 수유 중에도 한 손으로 기록하는 육아일지입니다. 버튼을 한 번 누르면 바로 기록되고, 수유와 수면은 타이머가 켜집니다. 초대 코드로 보호자와 함께 쓰고, 한 번 결제로 광고를 없앨 수 있습니다.',
      en: "Log your baby's day with one hand, even during a 3 a.m. feed. One tap saves the record and starts a timer for feeds and sleep. Share with another caregiver by invite code, and pay once to remove ads.",
    },
    features: [
      { title: { ko: '원탭 기록', en: 'One-tap logging' }, body: { ko: '수유, 기저귀, 수면, 목욕 버튼 네 개', en: 'Feed, diaper, sleep and bath buttons' } },
      { title: { ko: '하루 리듬 통계', en: 'Daily rhythm' }, body: { ko: '24시간 띠, 밤 요약, 수유 간격', en: '24-hour strip, night summary, feeding intervals' } },
      { title: { ko: '성장 그래프', en: 'Growth graph' }, body: { ko: '몸무게, 키, 머리둘레를 꺾은선으로', en: 'Weight, height and head circumference' } },
      { title: { ko: '보호자 공유', en: 'Caregiver sharing' }, body: { ko: '초대 코드로 연결, 2명까지 무료', en: 'Invite code, two caregivers free' } },
    ],
    shots: 0,
    icon: '/img/icon-babylog.png',
    accent: '#ff9ec4',
    banner: '/img/fg-babylog.png',
    privacy: { ko: '/babylog/privacy/', en: '/en/babylog/privacy/' },
    deletion: { ko: '/babylog/deletion/', en: '/en/babylog/deletion/' },
    stores: {},
  },
];

export const worksBy = (category: Category) => WORKS.filter((w) => w.category === category);
