import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const BLOG_CATEGORY_KEYS = ['making', 'news', 'culture'] as const;
export const AUTHOR_KEYS = ['hongmacho'] as const;

// YAML은 따옴표 없는 2026-10-31을 UTC 자정 Date로 읽는다. 어느 쪽으로 적어도 날짜 문자열로 맞춘다
const dateString = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((d) => d.toISOString().slice(0, 10))]);

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
    date: dateString,
    // 글을 고친 날. 고칠 때만 적는다
    updated: dateString.optional(),
    // 작성자 키. 표시 이름은 data/blog.ts AUTHORS
    author: z.enum(AUTHOR_KEYS).default('hongmacho'),
    category: z.enum(BLOG_CATEGORY_KEYS),
    excerpt: z.string().max(140),
    tags: z.array(z.string()).min(1).max(5),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    works: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }).refine((d) => !d.cover || Boolean(d.coverAlt), { message: 'cover가 있으면 coverAlt도 적어야 합니다', path: ['coverAlt'] })
    .refine((d) => !d.updated || d.updated >= d.date, { message: 'updated는 date보다 앞설 수 없습니다', path: ['updated'] }),
});

export const collections = { blog };
