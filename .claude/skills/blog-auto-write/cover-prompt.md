# 블로그 표지 생성 문장

`<장면>`만 글 주제에 맞게 바꾼다. 나머지 줄은 고정이다.

```
Generate one image with the image generation tool and save it.
Wide landscape illustration for a game studio blog cover, 16:9 composition (it will be cropped to 1600x900, keep the subject centered with margin on all sides).
Scene: <장면. 예: a cheerful yellow school bus driving out of a packed colorful parking lot, small happy passengers waving>
Style: bright 3D cartoon illustration with soft volume and depth, glossy toy-like materials, thick dark navy outlines, playful and friendly mood. No flat shapes, no single-color backgrounds.
Palette: deep navy #16224f for outlines, ocean blue #1e7bff, sky blue #5cc8ff, sunny yellow #ffc21a, tangerine #ff7a1a, with white highlights.
Background: soft sky blue with subtle white dots or gentle waves.
Absolutely no text, letters, numbers, logos or watermarks anywhere in the image.
```

- 웨이브웍스 마스코트(파란 물방울 파도 캐릭터)를 표지의 주인공으로 쓴다(사용자 지시 2026-11-06: 표지에 로봇이 나와 브랜드와 따로 놀았다). 참고 이미지는 `public/img/mascot-about.png`이고 `codex exec -i <경로>`로 넘긴다. 장면 줄에 "the blue water-wave mascot character from the reference image" 같은 문장으로 캐릭터를 지정하고, 캐릭터의 얼굴 모양·파란 색·진한 외곽선을 바꾸지 않는다. AI 도구가 나오는 글도 로봇 대신 마스코트가 일하는 장면으로 그린다. 로봇, 사람 얼굴, 실제 브랜드는 넣지 않는다.
- 작품 글은 작품 아이콘(`public/works/<id>/icon.png`)의 대표 사물과 색을 장면에 넣는다. 아이콘 그림 자체를 복제하지는 않는다.
- 사람 얼굴 사진풍, 실제 브랜드, 남의 게임 캐릭터는 넣지 않는다.
- 표지는 목록 카드와 글 첫머리에 그대로, 글 상세 헤더에는 남색 막(62%)을 덮어 흰 제목 뒤 배경으로 쓰인다.
