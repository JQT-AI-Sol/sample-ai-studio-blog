# シンプルブログサイト実装計画 (Next.js + Sanity)

## Context

要件ドキュメント(`requwirement.md`)に基づき、Next.js (App Router) + Sanity CMS でシンプルなブログサイトを新規構築する。現在プロジェクトディレクトリには要件ファイルのみ存在し、コードは一切ない状態からのスタート。

**ゴール**: 記事一覧（トップページ）と記事詳細ページの2ページ構成のブログ。Sanity Studioを `/studio` に埋め込み、コンテンツ管理もできるようにする。

---

## Phase 1: プロジェクト初期化

### Step 1: Next.js プロジェクト作成
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

### Step 2: 依存パッケージインストール
```bash
npm install next-sanity @portabletext/react sanity @tailwindcss/typography
```

### Step 3: 環境変数ファイル作成
`.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=au8lf84i
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Phase 2: ファイル作成（実装順序）

| # | ファイル | 操作 | 内容 |
|---|---------|------|------|
| 1 | `.env.local` | 新規 | Sanity環境変数 |
| 2 | `src/sanity/schemas/post.ts` | 新規 | 記事スキーマ (title, slug, publishedAt, body) |
| 3 | `src/sanity/schemas/index.ts` | 新規 | スキーマのバレルエクスポート |
| 4 | `src/sanity/lib/client.ts` | 新規 | Sanityクライアント + sanityFetchヘルパー (ISR対応) |
| 5 | `src/sanity/lib/queries.ts` | 新規 | GROQクエリ (一覧・詳細・スラッグ一覧) |
| 6 | `sanity.config.ts` | 新規 | Sanity Studio設定 (basePath: /studio) |
| 7 | `src/app/studio/[[...tool]]/page.tsx` | 新規 | 埋め込みSanity Studio |
| 8 | `src/app/globals.css` | 修正 | `@tailwindcss/typography` プラグイン追加 |
| 9 | `src/app/layout.tsx` | 修正 | ヘッダー追加、ライトモード、Inter フォント、lang="ja" |
| 10 | `src/app/page.tsx` | 修正 | トップページ: 記事一覧 (Server Component) |
| 11 | `src/app/posts/[slug]/page.tsx` | 新規 | 記事詳細: PortableText表示 + generateStaticParams |

---

## Phase 3: 各ファイルの詳細

### Sanityスキーマ (`src/sanity/schemas/post.ts`)
- 4フィールド: `title` (string, 必須), `slug` (slug, titleから自動生成), `publishedAt` (datetime), `body` (Portable Text)
- `publishedAt`降順でソート

### Sanityクライアント (`src/sanity/lib/client.ts`)
- `next-sanity` の `createClient` を使用
- `sanityFetch` ヘルパー: ISR (60秒) をデフォルトに
- `useCdn: true` で高速読み取り

### GROQクエリ (`src/sanity/lib/queries.ts`)
- `POSTS_QUERY`: 一覧用 (body除外、publishedAt降順)
- `POST_QUERY`: 詳細用 (slug指定、body含む)
- `POST_SLUGS_QUERY`: generateStaticParams用

### トップページ (`src/app/page.tsx`)
- Server Componentでデータ取得
- 記事がない場合は「No articles yet.」表示
- 各記事: タイトル + 公開日 (日本語フォーマット)

### 記事詳細 (`src/app/posts/[slug]/page.tsx`)
- `generateStaticParams` でビルド時に静的生成
- `@portabletext/react` でリッチテキスト表示
- Tailwind Typography (`prose`) で読みやすいスタイリング
- 存在しないスラッグは `notFound()` で404

### デザイン
- ライトモード: `bg-white text-gray-900`
- `max-w-2xl` で読みやすいコンテンツ幅
- Inter フォント
- シンプルなヘッダー (ブログ名のみ)

---

## Phase 4: 検証手順

1. **`npm run dev`** → `http://localhost:3000` で「No articles yet.」表示を確認
2. **`http://localhost:3000/studio`** → Sanity Studioが起動することを確認
3. **Sanity管理画面** (`sanity.io/manage`) でCORSオリジン `http://localhost:3000` を追加
4. **テスト記事作成** → Studioで記事を作成・公開
5. **トップページ確認** → 記事一覧に表示される
6. **記事詳細確認** → クリックで詳細ページに遷移、本文が表示される
7. **`npm run build`** → ビルドエラーがないことを確認

---

## 注意事項

- Tailwind v3/v4 の違い: `create-next-app` が生成するバージョンに応じてtypographyプラグインの設定方法を調整
- Next.js 15 では `params` が `Promise` になるため `await` が必要
- Sanity CORS: localhost と本番URLの両方を Sanity管理画面で追加する必要あり
