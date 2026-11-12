import type { APIRoute } from 'astro';
import { rssResponse } from '../../data/rss';

export const GET: APIRoute = ({ site }) => rssResponse(site, 'en');
