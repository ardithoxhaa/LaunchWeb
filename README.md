# LaunchWeb

**Elementor-Style Website Builder SaaS for Small Businesses**

LaunchWeb is a production-quality, full-stack website builder platform that enables non-technical users to visually build professional websites in minutes. It features an Elementor-style drag-and-drop editor with a clear hierarchy (Page → Section → Column → Widget), instant visual feedback, and everything editable.

## 🎯 Key Features

- **Visual-First Editing**: Elementor-style drag-and-drop builder
- **30+ Widgets**: Heading, Text, Image, Button, Hero, Features, Pricing, FAQ, Testimonials, Contact Form, and more
- **10+ Professional Templates**: Restaurant, Gym, Agency, Portfolio, Real Estate, Education, Healthcare, SaaS, E-commerce
- **Version History**: Automatic snapshots with rollback capability
- **SEO Editor**: Per-page meta tags, Open Graph, Twitter Cards
- **Responsive Design**: Desktop, Tablet, Mobile viewport editing
- **Publish/Preview**: Draft preview and controlled publishing
- **Admin Dashboard**: User management, template CRUD, analytics

## Tech Stack

### Frontend
- **React 18** (JavaScript, Hooks, Context API)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop
- **Vite** for build tooling

### Backend
- **Node.js** with **Express.js**
- **RESTful API** with clean layered architecture
- **Zod** for validation
- **JWT** access + refresh tokens

### Database
- **MySQL** with JSON columns for flexible structure
- Normalized schema: users, roles, businesses, websites, pages, templates, assets, versions

## Monorepo Structure

```
LaunchWeb/
├── frontend/                 # React application
│   └── src/
│       ├── builder/          # Elementor-style editor
│       │   ├── components/   # Canvas, Panels, Widgets
│       │   ├── store/        # State management
│       │   └── widgets/      # Widget registry
│       ├── pages/            # Public, User, Admin pages
│       └── auth/             # Authentication context
├── backend/                  # Express API
│   └── src/
│       ├── modules/          # Feature modules
│       ├── middleware/       # Auth, error handling
│       └── config/           # Database, environment
└── backend/database/
    ├── schema.sql            # Database schema
    ├── seed.sql              # Initial templates
    └── additional-templates.sql  # More industry templates
```

## Prerequisites

- Node.js (18+ recommended)
- MySQL 8+

## Environment variables

### Backend

Copy the example file and adjust values:

1. Create `backend/.env` from `backend/.env.example`
2. Ensure these are set:
   - `CLIENT_ORIGIN` (usually `http://localhost:5173`)
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

### Frontend

Copy the example file and adjust values:

1. Create `frontend/.env.local` from `frontend/.env.example`
2. Ensure `VITE_API_BASE_URL` points to the backend API, e.g. `http://localhost:5000/api`

## Database setup

Create the schema and seed data in MySQL:

1. Run `backend/database/schema.sql`
2. Run `backend/database/seed.sql`

Notes:

- The schema creates the `launchweb` database.
- Templates are stored as JSON and are seeded in `seed.sql`.

## Run locally (development)

Install dependencies:

- `npm install`

Run both backend + frontend:

- `npm run dev`

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health: `http://localhost:5000/api/health`

## Common workflows

- **Register/Login**: create an account, login, and the app will use refresh tokens for session continuity.
- **Create business**: create a business in the dashboard.
- **Create website from template**: choose a template and generate a website.
- **Edit**: use `/editor/:id` for the basic editor and `/builder/:id` for the advanced builder.
- **Preview**: use draft preview for drafts; public preview works when published.
- **Publish/unpublish**: control public availability per website.

## Admin

Admin routes are protected by role-based authorization. The admin dashboard is available at:

- `/admin`

## Production notes

- Set `NODE_ENV=production`.
- Configure `CLIENT_ORIGIN` to your production frontend URL.
- Use strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- Serve the frontend build output separately (Vite build), and point `VITE_API_BASE_URL` to the deployed API.

## 🧩 Builder Architecture

### Editing Hierarchy (Elementor-style)
```
Website
 └── Pages
      └── Sections
           └── Columns
                └── Widgets
```

### Available Widgets

| Category | Widgets |
|----------|---------|
| **Basic** | Heading, Text Editor, Image, Button, Divider, Spacer |
| **General** | Icon, Icon Box, Star Rating, Counter, Progress Bar, Testimonial, Accordion, Tabs, Social Icons |
| **Site** | Navigation, Hero Section, Features, Pricing Table, FAQ, Testimonials, Contact Form, Footer |
| **Pro** | Video, Gallery, Carousel, Logo Cloud, Cards, Stats, Call to Action, Team |

### Builder Features

- **Left Panel**: Widget library with search, Navigator tree, Global settings
- **Canvas**: Live preview with viewport switching, inline editing
- **Right Panel**: Content, Style, and Advanced tabs for selected element
- **Keyboard Shortcuts**: Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+S (save), Ctrl+D (duplicate), Delete

## 📋 Templates

| Template | Industry | Pages |
|----------|----------|-------|
| StrideWorks | Sports/E-commerce | Home, Collections, Stories, Plans, FAQ |
| MonoTech | Software | Home, Products, Plans, Support |
| VoltDrive | Automotive | Home, Models, Plans, FAQ, Contact |
| Nimbus SaaS | Software | Home, Features, Pricing, Stories, Contact |
| Harbor Dental | Healthcare | Home, About, FAQ, Contact |
| Savory Kitchen | Restaurant | Home, Menu, Reservations |
| Apex Fitness | Fitness | Home, Programs, Pricing, Contact |
| Northwind Studio | Agency | Home, Work, Services, Contact |
| Alex Portfolio | Portfolio | Home, Work, About, Contact |
| Prime Properties | Real Estate | Home, Listings, Contact |
| Bright Academy | Education | Home, Courses, Pricing, Contact |

## 🔐 Security

- JWT access tokens (15min expiry) + refresh tokens (7 days, httpOnly cookie)
- Password hashing with bcrypt
- Role-based access control (USER, ADMIN)
- Protected API routes with middleware
- CORS configuration
- Helmet security headers

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/logout` - Logout

### Websites
- `GET /api/websites/business/:id` - List websites
- `POST /api/websites` - Create from template
- `GET /api/websites/:id/builder` - Get builder data
- `PUT /api/websites/:id/builder` - Save builder data
- `PUT /api/websites/:id/seo` - Update SEO
- `POST /api/websites/:id/publish` - Publish
- `POST /api/websites/:id/unpublish` - Unpublish
- `GET /api/websites/:id/versions` - List versions
- `POST /api/websites/:id/versions/:versionId/restore` - Restore version

### Admin
- `GET /api/admin/overview` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/role` - Update role
- `GET /api/admin/templates` - List templates
- `POST /api/admin/templates` - Create template
- `DELETE /api/admin/templates/:id` - Delete template

## 🎓 Diploma-Level Features

✅ Visual drag-and-drop builder (Elementor-style)
✅ Multi-page website support
✅ Template cloning (no shared data)
✅ Version history with rollback
✅ SEO editor per page
✅ Responsive editing modes
✅ Publish/unpublish control
✅ Preview mode (draft & public)
✅ Admin dashboard
✅ JWT authentication with refresh tokens
✅ Role-based access control
✅ Clean architecture (Controllers/Services/Repositories)
✅ MySQL with JSON columns
✅ Production-ready code structure
