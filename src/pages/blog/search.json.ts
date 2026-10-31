import type { APIRoute } from 'astro';
import { searchIndex } from '../../data/blog';

export const GET: APIRoute = async () => Response.json(await searchIndex('ko'));
