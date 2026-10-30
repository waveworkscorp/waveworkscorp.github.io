import { defineConfig } from 'astro/config';
import { readdir, rename, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS } from './src/data/works.ts';

// 'directory' 형식은 옛 약관 주소 babylog/privacy-ko.html을 privacy-ko.html/index.html로 만든다.
// 스토어에 등록한 .html 주소가 그대로 열리게 빌드 뒤 파일 하나로 되돌린다
async function flattenHtmlRoutes(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (!entry.name.endsWith('.html')) {
      await flattenHtmlRoutes(path);
      continue;
    }
    const tmp = `${path}.tmp`;
    await rename(join(path, 'index.html'), tmp);
    await rmdir(path);
    await rename(tmp, path);
  }
}

const LEGACY_LEGAL = {
  '/babylog/privacy-ko.html': '/babylog/privacy/',
  '/babylog/privacy-en.html': '/en/babylog/privacy/',
  '/babylog/account-deletion-ko.html': '/babylog/deletion/',
  '/babylog/account-deletion-en.html': '/en/babylog/deletion/',
  '/unscrew/privacy.html': '/unscrew/privacy/',
  '/unscrew/terms.html': '/unscrew/terms/',
  '/unscrew/data-deletion-ko.html': '/unscrew/deletion/',
  '/unscrew/data-deletion-en.html': '/en/unscrew/deletion/',
  '/yokai-hunters/privacy.html': '/yokai-hunters/privacy/',
  '/yokai-hunters/terms.html': '/yokai-hunters/terms/',
  '/yokai-hunters/en/privacy.html': '/en/yokai-hunters/privacy/',
  '/yokai-hunters/en/terms.html': '/en/yokai-hunters/terms/',
  // 삐약도쿠 앱 설정 화면이 여는 옛 약관 주소. 개인정보 처리방침(/privacy/)은 두 게임 앱·스토어가 함께 걸어 두어 문서째 남긴다
  '/terms/': '/cheepdoku/terms/',
  '/en/terms/': '/en/cheepdoku/terms/',
};

export default defineConfig({
  site: 'https://waveworkscorp.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // 옛 주소(상세 /works/<slug>/, 스토어에 등록한 약관 .html)는 새 주소로 보낸다
  redirects: {
    ...Object.fromEntries(WORKS.flatMap(({ slug }) => [
      [`/works/${slug}/`, `/${slug}/`],
      [`/en/works/${slug}/`, `/en/${slug}/`],
    ])),
    ...LEGACY_LEGAL,
  },
  integrations: [{
    name: 'flatten-html-routes',
    hooks: { 'astro:build:done': ({ dir }) => flattenHtmlRoutes(fileURLToPath(dir)) },
  }],
});
