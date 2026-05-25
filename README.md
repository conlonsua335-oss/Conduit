# Conduit — Real World Blogging Platform

A Medium-inspired blogging platform built with React, TypeScript, and Tailwind CSS. This project implements the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

---

## Demo

> Live API: `https://node-express-conduit.appspot.com/api`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI Framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Client-side routing (HashRouter) |
| react-markdown | 9 | Render article body as markdown |

---

## Features

### Authentication
- Register a new account
- Login with email & password
- Logout
- Persist login state on page reload (sessionStorage)
- Protected routes — redirect to login if not authenticated

### Home Page
- Global Feed — all articles
- Your Feed — articles from followed authors (login required)
- Filter articles by tag
- Pagination (10 articles per page)
- Tags sidebar

### Articles
- View article detail with markdown rendering
- Create new article with tag input
- Edit existing article (owner only)
- Delete article (owner only)
- Favorite / Unfavorite article

### Comments
- View all comments on an article
- Add new comment (login required)
- Delete own comment

### Profile
- View author profile with avatar and bio
- My Articles tab
- Favorited Articles tab
- Follow / Unfollow author

### Settings
- Update avatar URL, username, bio, email
- Change password
- Logout from settings page

---

## Project Structure

```
src/
├── api/
│   ├── client.ts        # Base API request handler (token, headers, errors)
│   ├── auth.ts          # Login, register, getCurrentUser, updateUser
│   ├── articles.ts      # CRUD articles, favorite, follow, comments
│   └── tags.ts          # Get tags list
├── components/
│   ├── ArticleCard.tsx  # Article preview card
│   ├── CommentCard.tsx  # Single comment
│   ├── AddComment.tsx   # Add comment form
│   ├── FavoriteButton.tsx
│   ├── FollowButton.tsx
│   ├── Pagination.tsx
│   ├── Loading.tsx
│   ├── ErrorMessage.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── auth-context.ts  # AuthState type + createContext
│   ├── AuthProvider.tsx # Fetch user on load, login/logout logic
│   └── useAuth.ts       # Hook to read AuthContext
├── layouts/
│   └── MainLayout.tsx   # Sidebar nav + header + outlet
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ArticlePage.tsx
│   ├── EditorPage.tsx
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
├── types/
│   └── index.ts         # User, Article, Comment, Profile, Tag types
└── utils/
    └── formatDate.ts    # Date formatting helper
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/conduit.git
cd conduit

# Install dependencies
npm install
```

### Environment Setup

The project uses Vite proxy to avoid CORS issues in development. No `.env` file is needed — the proxy is configured in `vite.config.ts`:

```ts
server: {
  proxy: {
    "/api": {
      target: "https://node-express-conduit.appspot.com",
      changeOrigin: true,
    },
  },
},
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## Git Workflow

Each User Story is developed on a separate branch and merged into `main` via Pull Request.

```bash
# Start a new US
git checkout main
git pull
git checkout -b feature/US-xx-feature-name

# After coding
git add .
git commit -m "US-xx: description"
git push origin feature/US-xx-feature-name

# Open PR on GitHub → merge → sync
git checkout main
git pull
```

### Commit Convention

```
feat: add new feature
fix:  fix a bug
refactor: improve code without changing behavior
style: UI changes only
```

---

## User Stories Implemented

| US | Feature | Status |
|---|---|---|
| US-01 | Routing — HashRouter, 8 pages |  Done |
| US-02 | Layout — Header, Footer, MainLayout |  Done |
| US-03 | API Client — client.ts |  Done |
| US-04 | TypeScript Types |  Done |
| US-05 | AuthContext |  Done |
| US-06 | Register |  Done |
| US-07 | Login |  Done |
| US-08 | Logout |  Done |
| US-09 | Protected Routes |  Done |
| US-11 | Home — Global Feed |  Done |
| US-12 | Home — Tags Sidebar |  Done |
| US-13 | Filter by Tag |  Done |
| US-14 | Pagination |  Done |
| US-15 | Your Feed |  Done |
| US-16 | Article Preview Component |  Done |
| US-17 | Article Detail Page |  Done |
| US-18 | Markdown Render |  Done |
| US-19 | Create Article |  Done |
| US-20 | Edit Article |  Done |
| US-21 | Delete Article |  Done |
| US-22 | Follow / Unfollow Author |  Done |
| US-23 | Load Comments |  Done |
| US-24 | Add Comment |  Done |
| US-25 | Delete Comment |  Done |
| US-26 | Favorite Article |  Done |
| US-27 | Follow User |  Done |
| US-28 | Profile Info |  Done |
| US-29 | Profile — My Articles |  Done |
| US-30 | Profile — Favorited Articles |  Done |
| US-31 | Settings — Load User |  Done |
| US-32 | Settings — Update User |  Done |
| US-33 | Error Handling |  Done |
| US-34 | Loading State |  Done |
| US-35 | Date Format |  Done |
| US-36 | Responsive UI |  Done |
| US-37 | Test Flows |  Done |
| US-38 | Refactor Code |  Done |
| US-39 | README |  Done |

---

## Known Limitations

- The public API server (`node-express-conduit.appspot.com`) is shared — may occasionally be slow or return rate limit errors
- Image URLs from authors may be broken (handled with fallback to first letter avatar)
- No real-time updates — page refresh required to see other users' new content

---

## License

MIT