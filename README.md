# 📰 Conduit — Medium Clone

Ứng dụng blog platform clone theo thiết kế của [RealWorld](https://github.com/gothinkster/realworld), cho phép người dùng đăng bài viết, theo dõi tác giả, và tương tác với cộng đồng.

---

## Mô tả

Conduit mô phỏng đầy đủ trải nghiệm của một nền tảng blog hiện đại:

🧑‍💻 **Guest** → 📝 **Reader** → ✍️ **Author** → 💛 **Follower**

---

## Tính năng

| Trang | Chức năng |
|---|---|
| **HomePage** | Xem feed bài viết, lọc theo tag, phân trang, yêu thích bài viết |
| **ArticlePage** | Đọc bài viết, comment, follow tác giả, favorite |
| **Editor** | Tạo và chỉnh sửa bài viết (title, description, body, tags) |
| **Profile** | Xem profile tác giả, danh sách bài viết & bài đã thích |
| **Auth** | Đăng ký, đăng nhập, lưu session bằng JWT |
| **Settings** | Cập nhật thông tin cá nhân, đổi password, đăng xuất |

---

## Các tính năng đã hoàn thành

### ✅ HomePage — Redesign & Bug Fixes

- Redesign toàn bộ giao diện HomePage
- Fix bug **"Show more / Show less" tags** — tags không render khi `showAllTags = true`
- Fix bug **pagination** — page 2 trả về cùng data với page 1 (server dùng `page` thay vì `offset`)
- Chuyển token storage từ `localStorage` → `sessionStorage` (phải đăng nhập lại mỗi session)
- Logo click reset feed về tab "Featured" (`state={{ resetFeed: true }}` + `useEffect`)
- **FavoriteButton** redirect về `/login` khi chưa xác thực (thay vì disabled)

### ✅ ArticleCard — Redesign

- Author avatar + username + date chuyển lên top row
- Thumbnail image bên phải (picsum.photos seeded by slug)
- Footer: FavoriteButton + comment count icon + tags
- Comment count fetch live qua `GET /articles/:slug/comments` (hiển thị "..." khi loading)

### ✅ ArticlePage — Full Redesign

- Bỏ dark banner, thay bằng layout trắng sạch
- Thêm thumbnail image (picsum.photos seeded by slug)
- Description hiển thị bên dưới title
- FollowButton đặt inline cạnh tên tác giả
- Fix `isCommentsLoading` dùng đúng biến (trước đó dùng nhầm `isLoading`)

### ✅ Header — Redesign

- Sticky top với border
- Nút "Write" có pencil icon
- Avatar hiển thị chữ cái đầu của username
- Nút "Get started" dạng pill cho unauthenticated users

### ✅ FavoriteButton — Tạo lại từ đầu

- Heart icon SVG, filled khi đã favorited
- Toggle favorite/unfavorite qua API
- Redirect `/login` nếu chưa xác thực
- Thêm `favoriteArticle()` và `unfavoriteArticle()` vào `articles.ts`

---

## Bug Fixes

| Bug | Nguyên nhân | Cách fix | Trạng thái |
|---|---|---|---|
| Unsplash image không load | `source.unsplash.com` đã deprecated | Chuyển sang `picsum.photos` với slug làm seed | ✅ Resolved |
| FavoriteButton không hiển thị | File component bị xóa nhầm | Tạo lại `FavoriteButton.tsx` từ đầu | ✅ Resolved |
| Tags "Show more" không render | Bug conditional rendering — thiếu `.map()` | Bọc điều kiện trong ngoặc: `(showAllTags ? tags : tags.slice(0, 20)).map(...)` | ✅ Resolved |
| Page 2 trả về cùng data page 1 | Server không nhận `offset`, chỉ nhận `page` | Đổi `listArticles()` gửi `page` thay `offset` | ✅ Resolved |
| Comment count không hiển thị | `GET /api/articles` không trả `commentCount` | Thêm `useEffect` trong `ArticleCard` gọi riêng `GET /articles/:slug/comments` | ✅ Resolved |

---

## Auth Flow

JWT-based authentication với `sessionStorage`:

- Token được ký bởi server và lưu tại client (`sessionStorage`)
- Mỗi request tự động gắn header `Authorization: Token <jwt>`
- Reload trang → vẫn còn đăng nhập
- Đóng tab / đóng browser → phải đăng nhập lại
- `AuthProvider` tự verify token khi mount — nếu server trả `401` thì xóa token và reset state

---

## Công nghệ

| Layer | Tech |
|---|---|
| **Frontend** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | CSS Modules / TailwindCSS |
| **Routing** | React Router DOM v6 |
| **Auth** | JWT + sessionStorage |
| **API** | RealWorld Conduit API |

---

## Cài đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Truy cập: [http://localhost:5173](http://localhost:5173)

### Build Production

```bash
npm run build
npm run preview
```

---

## Cấu trúc thư mục

```
src/
├── App.tsx                  # Root component + routing
├── main.tsx                 # Entry point
├── context/
│   └── AuthProvider.tsx     # JWT auth context, sessionStorage
├── api/
│   ├── client.ts            # Axios instance + token injection
│   ├── articles.ts          # Article CRUD + favorite/unfavorite
│   ├── auth.ts              # Login, register, getCurrentUser
│   └── comments.ts          # Comment CRUD
├── pages/
│   ├── HomePage.tsx         # Feed + tags + pagination
│   ├── ArticlePage.tsx      # Article detail + comments
│   ├── LoginPage.tsx        # Đăng nhập
│   ├── RegisterPage.tsx     # Đăng ký
│   ├── EditorPage.tsx       # Tạo / sửa bài viết
│   ├── ProfilePage.tsx      # Profile tác giả
│   └── SettingsPage.tsx     # Cài đặt tài khoản
└── components/
    ├── ArticleCard.tsx      # Card bài viết (thumbnail, favorite, comment count)
    ├── FavoriteButton.tsx   # Heart button với API toggle
    ├── FollowButton.tsx     # Follow/unfollow tác giả
    └── Header.tsx           # Sticky header với avatar
```

---

## Tài liệu

- [Sequence Diagrams — Auth Flow](./docs/auth-sequence.drawio)
- [RealWorld API Spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction)