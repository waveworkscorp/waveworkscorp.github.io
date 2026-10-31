---
title: "How WaveWorks makes games"
date: "2026-10-31"
category: culture
excerpt: "Our first game, Bus Loop Escape, took 9 days and 313 commits. Here are the order and rules our one-person studio now follows with AI agents."
tags: ["How we work", "AI", "Unity", "Localization"]
cover: ../../../assets/blog/2026-10-31-how-waveworks-makes-games/cover.jpg
coverAlt: "Two small robots on a studio desk stacking blocks into game screens"
works: ["bus-jam"]
---

WaveWorks is a one-person game studio founded in October 2025. Work that's too much for one person gets shared with AI agents: the founder decides what to make, Claude Code writes and checks the code, and Codex handles the art.

Our first game, Bus Loop Escape, took 313 commits over 9 days, from October 3 to 11, 2026, and went live on Google Play on October 19. Looking back at those 9 days, we could see where the order needed to change, so we wrote down the order and the rules we'd follow from the next game on.

## What the first game taught us

| Item | Record |
|---|---|
| Development | Oct 3 – Oct 11, 2026, 9 days |
| Commits | 313 |
| First pass of rules, level generator and ads | 4 days (Oct 3 – Oct 6) |
| Art and effects commits | About 145 (46%) |
| Day the release to-do list was written | Day 7 (Oct 9) |

The game rules worked within four days. The time went into what came after. Close to half of the commits were art and effects, and release prep took longest of all. We could have known about store account approval and translations on day one, yet they didn't make the to-do list until day 7.

![Tapping out the buses that are free to move in Bus Loop Escape](/works/bus-jam/shots/en-1.jpg)

## A release sheet on day one

Now the release sheet comes before the game plan. On day one we write down the regions and languages, store accounts, app name, revenue model and review materials, and we send off the slow account applications that same day.

After that, the work runs in seven stages, each with a gate to pass before the next one starts.

1. Release sheet: set the release conditions on day one
2. Plan: write who the game is for in one paragraph
3. Analysis: compare similar games and their features
4. Design: settle the art direction and screens in the first week
5. Vertical slice: build one full round in the chosen art, and the founder plays it
6. Build and release: add content, test on real phones, then release
7. Operate: check installs, return visits and revenue at 2, 4 and 8 weeks after launch, then decide what to invest in next

Until the vertical slice passes, we don't mass-produce levels or art. That rule comes from redrawing the first game's art more than once.

## Build once, use in every game

Ads, payments, saving and analytics don't get rebuilt for each game. We split the code from Bus Loop Escape into shared packages, and later games pick it up from there. Each game passes just its own values, like the app ID, ad units and product IDs, as settings.

Every game also opens the same way: the WaveWorks logo first, then the game's loading screen, then home. Long-press the icon in any of our games and you'll find "Don't leave" and "Contact us" shortcuts.

On October 26, 2026, we decided to move our games to Unity. New games start in Unity, and the earlier ones built with web tech will move over one by one. With more games on the way, sharing the same tools and structure means less hunting around when something needs fixing.

## Ten languages in mind from the start

Every game first ships in five languages: Korean, English, Japanese, and Simplified and Traditional Chinese. Then we add German, French, Spanish, Brazilian Portuguese and Indonesian, for ten in total.

Translation doesn't stop at the in-game text. App names, store descriptions and screenshots get their own version in each language too. Bus Loop Escape supports the first five languages today.

## No flat screens

Every game gets depth. We don't ship screens filled with single-color surfaces and plain shapes. 3D games get it from lighting, shadows and materials, 2D games from shadows, highlights, thickness and press effects. Buttons and pop-ups are no exception.

Testing happens three times: first in the development view, again after installing on an emulator, and last on a real phone in our hands. A game doesn't ship until it holds up on both a high-end and a budget device.

## What's next

We're preparing the iOS version of Bus Loop Escape and its move to Unity. Our other games are going through the same steps, and we'll post here as each one comes out. If you play our games and have ideas, send them through the [contact page](/en/contact/).
