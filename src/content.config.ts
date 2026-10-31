import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const BLOG_CATEGORY_KEYS = ['making', 'news', 'culture'] as const;

// 글 하나는 src/content/blog/<언어>/<YYYY-MM-DD-slug>.md. 영어판은 같은 파일명으로 en/에 둔다
const blog = defineCollection({
  loader: glob({
    pattern: '{ko,en}/*.md',
    base: './src/content/blog',
    // 기본 id는 파일명을 slug로 바꿔 언어 폴더와 날짜 형식이 흐트러진다. 경로를 그대로 쓴다
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // YAML은 따옴표 없는 2026-10-31을 UTC 자정 Date로 읽는다. 어느 쪽으로 적어도 날짜 문자열로 맞춘다
    date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((d) => d.toISOString().slice(0, 10))]),
    category: z.enum(BLOG_CATEGORY_KEYS),
    excerpt: z.string().max(140),
    tags: z.array(z.string()).min(1).max(5),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    works: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }).refine((d) => !d.cover || Boolean(d.coverAlt), { message: 'cover가 있으면 coverAlt도 적어야 합니다', path: ['coverAlt'] }),
});

export const collections = { blog };
