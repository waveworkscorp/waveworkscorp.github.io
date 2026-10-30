# WaveWorks 홈페이지 시안 이미지 생성 문장

2026-10-30, Codex CLI(`codex exec`, image_generation)로 생성. 공통 참고 이미지는 `docs/platform/splash/logos/logo1-color.png`, `ww-3-color.png`. 원본은 `~/.codex/generated_images/`에 남고 사본을 `master/`에 둔다.

## 공통 화풍

Glossy cartoon sticker style matching the attached WaveWorks logo: thick dark navy outline (#16224F, about 14px at 1024px), saturated sky blue and ocean blue (#1E8BFF, #5CC8FF), white foam highlights, sunny yellow and orange accents (#FFC21A, #FF8A1F), soft inner shading, glossy highlights. No text, no letters, no logos, no watermark.

## 1. 마스코트 (시안 C 메뉴)

파도 물방울 캐릭터 "웨이비". 1024x1024 투명 배경, 전신, 가운데.

- `mascot-works.png`: holding a small game controller, excited jump pose
- `mascot-about.png`: waving hello with one hand, big smile
- `mascot-contact.png`: holding a white envelope letter, friendly wink

## 2. 섬 타일 (시안 B 지도)

1024x1024 투명 배경, 아이소메트릭 작은 섬 하나, 같은 각도와 크기.

- `island-works.png`: tiny island with a colorful arcade cabinet booth and floating game icons as bubbles
- `island-about.png`: tiny island with a striped blue-white lighthouse and a palm tree
- `island-contact.png`: tiny island with a round red mailbox and a paper boat docked

## 3. 첫 화면 배경 (시안 A)

- `hero-wave.png`: 1920x1080 wide banner, a giant curling cartoon wave from left to right over a bright sky, small toy-like objects riding the wave (a school bus, a screw, a baby bottle, a chick, a small lantern ghost), right half calmer for headline space

## About 그림 4장 (2026-10-30)

원본 `art/master/{moment-subway,moment-night,moment-lunch,studio}.png` 1024px 투명, 사이트에는 720px로 줄여 `public/img/`에 넣음. 참고 이미지로 마스코트 그림을 붙임.

```text
Use your image generation tool to create 4 separate images (do not write code, do not draw with SVG or PIL). The attached images show our mascot 'Wavy', a water-drop wave character. Keep exactly the same character design and art style in every image: glossy cartoon sticker style, thick dark navy outline (#16224F, about 14px at 1024px), saturated sky blue and ocean blue (#1E8BFF, #5CC8FF), white foam highlights, sunny yellow and orange accents (#FFC21A, #FF8A1F), soft inner shading, glossy highlights. No text, no letters, no numbers, no logos, no watermark. Each image 1024x1024 with a fully transparent background, a single compact sticker-like vignette centered with some margin.
1) moment-subway: Wavy standing in a cute toy-like subway car, holding a hand strap with one hand and happily playing a puzzle game on a smartphone with the other.
2) moment-night: Wavy sitting in a cozy armchair at night under a small crescent moon and stars cluster, holding a sleeping baby in a blanket with one arm and tapping a phone with the other hand, soft warm lamp glow.
3) moment-lunch: Wavy relaxing on a park bench with a coffee cup and a lunch box, laughing at a phone game, a few leaves and a tiny sun.
4) studio: Wavy as a game maker at a chunky desk with a big monitor, building a toy-like miniature game world that pops out of the screen: a small yellow school bus, a giant screw, a chick, a baby bottle, a paper lantern ghost, floating colorful stars and sparkles.
When done, print the absolute file paths of the 4 generated images.
```

## 상세 화면 배경 5장 (2026-10-30)

원본 `art/master/bg-<slug>.png` 1536x1024, 사이트에는 1920px JPG로 `public/img/hero/<slug>.jpg`. 참고 이미지로 각 게임의 배너·아이콘을 붙임.

```text
Use your image generation tool to create 5 separate wide landscape background images (do not write code, do not draw with SVG or PIL). Each is a full-bleed website hero background for one mobile game or app, size 1536x1024 landscape. Match the art style and palette of that title's attached reference image (attached in this order: bus-jam banner, unscrew icon, yokai-hunters banner, cheepdoku icon, babylog banner). Composition rule for all 5: the right 55% holds the rich, detailed scene; the left 45% stays calm and simple (sky, soft ground, gentle gradient, low detail) so large headline text can sit on it. No text, no letters, no numbers, no logos, no UI, no watermark, no characters looking at camera in the left area.
1) bg-bus-jam: a bright sunny toy-like town parking lot seen from a 3/4 top view, packed with colorful chunky buses (yellow school bus in front), passengers in matching colors waiting, park trees and clouds. Left side: clear blue sky and soft green grass.
2) bg-unscrew: rolling green hills under a blue sky with fluffy clouds, a cute toy house held together by big glossy colorful screws on the right, a few loose screws flying with sparkles. Left side: open sky and smooth grass.
3) bg-yokai-hunters: a Korean traditional fortress wall at night under a big full moon, glowing paper lanterns, misty mountains, playful spooky Korean folklore yokai silhouettes (dokkaebi, fox spirit, lantern ghost) approaching from the right, deep navy and indigo with warm gold light. Left side: dark calm night sky with soft mist.
4) bg-cheepdoku: a cheerful farmyard garden made of colorful square garden plots like a puzzle grid, fluffy yellow chicks sitting in some plots, wooden fence, sunflowers, warm pastel yellow sunshine. Left side: soft pale yellow sky and plain grass.
5) bg-babylog: a soft pastel pink cozy nursery, white crib with a mobile, baby bottle, rubber duck, diapers stacked, a big window with a gentle moon and stars, warm and calm. Left side: plain soft pink wall with subtle light.
When done, print the absolute file paths of the 5 generated images in the order above.
```

## Contact 그림 5장 (2026-10-30)

원본 `art/master/{contact-hero,kind-help,kind-biz,kind-etc,envelope}.png` 1024px 투명, 사이트에는 720px. 참고 이미지 mascot-contact, studio.

```text
Use your image generation tool to create 5 separate images (do not write code, do not draw with SVG or PIL). Match exactly the art style of the attached images: glossy cartoon sticker style, thick dark navy outline (#16224F, about 14px at 1024px), saturated cheerful colors, soft highlights, transparent background, no text, no letters, no logos. Each image is 1024x1024 PNG with a transparent background, the subject centered with some margin.
1) contact-hero: the attached water-drop wave mascot 'Wavy' (same character design) riding a big white paper airplane through the sky, waving happily, a mail bag over the shoulder, colorful envelopes and little hearts flying behind in a trail. Dynamic diagonal pose, different from the attached poses.
2) kind-help: NO mascot. A chunky blue game controller and a smartphone with a big yellow question-mark speech bubble and a small wrench, sparkles.
3) kind-biz: NO mascot. Two friendly cartoon hands doing a high-five or handshake with a ribbon-wrapped gift box and confetti, coral and orange tones.
4) kind-etc: NO mascot. A cluster of three colorful speech bubbles (pink, mint, yellow) with a heart, a star and a musical note floating, playful.
5) envelope: NO mascot. A big open envelope with a letter peeking out, a scalloped postage stamp showing a blue wave, a red wax seal shaped like a heart, two small paper planes around it.
When done, print the absolute file paths of the 5 generated images in order. Save copies into art/master/ named contact-hero.png, kind-help.png, kind-biz.png, kind-etc.png, envelope.png.
```
