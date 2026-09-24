# Product Admin Dashboard

A production-ready frontend admin dashboard built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**. The application uses the public **DummyJSON REST API** to provide authentication, protected routes, product listing, search, category filtering, sorting, pagination, product details, and product CRUD operations with session-based handling for DummyJSON's non-persistent CRUD behavior.

## Project Overview

This dashboard allows authenticated store administrators to:

- Browse products in a responsive interface with a desktop table and mobile cards.
- Search products with debounce, request cancellation, and stale-response protection.
- Filter products by category and sort by price, rating, and title.
- Paginate through products with page sizes of 10, 20, and 50.
- View product details, images, and customer reviews.
- Add, edit, and delete products with validation and confirmation.
- Keep search, category, sorting, pagination, and page-size state synchronized with the URL.
- Maintain simulated CRUD changes during the current browser session.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.3.6 | Application framework and App Router |
| **React** | 19.2.8 | UI components and state management |
| **Tailwind CSS** | v4 | Responsive styling |
| **Axios** | ^1.20.0 | HTTP requests and centralized API handling |
| **DummyJSON API** | Public REST API | Authentication and product data |

## Features Implemented

### 1. Authentication & Route Protection

- Login using DummyJSON authentication.
- JWT/access-token handling through client-side storage helpers.
- Global authentication state using `AuthContext`.
- Protected `/products` routes.
- Redirect unauthenticated users to `/login`.
- Logout functionality.

### 2. Product Catalog

- Desktop product table.
- Mobile-friendly product cards.
- Product image fallback for missing or broken images.
- Product title, category, price, rating, stock, and actions.

### 3. Pagination

- API `limit` and `skip` pagination.
- Page sizes: 10, 20, and 50.
- Previous and Next controls.
- Numbered pagination with ellipsis for larger page counts.
- Visible range such as `Showing 1–10 of 100`.

### 4. Search

- 400ms debounced search.
- Search automatically resets to page 1.
- `AbortController` cancels previous requests.
- Request sequencing prevents stale responses from replacing newer results.
- Supports delayed API testing such as `&delay=2000`.

### 5. Category Filtering

- Categories loaded from DummyJSON.
- Category-specific product requests.
- Pagination resets when the category changes.
- Search and category limitations are handled in the UI because DummyJSON does not provide a combined search-and-category endpoint for this workflow.

### 6. Sorting

Supports:

- Price: Low to High / High to Low
- Rating: Low to High / High to Low
- Title: A-Z / Z-A

Sorting is synchronized with the URL and resets pagination when changed.

### 7. Product Details

- Dynamic `/products/[id]` route.
- Product image gallery.
- Product information including title, brand, description, category, price, rating, and stock.
- Customer reviews.
- Not-found handling for invalid or deleted products.

### 8. Add Product

- `/products/new` creation page.
- Category selection.
- Client-side validation.
- Positive price validation.
- Whole-number stock validation.
- Duplicate-submit protection.
- New products are registered in the current session.

### 9. Edit Product

- Prefilled edit form at `/products/[id]/edit`.
- Supports both original DummyJSON products and session-created products.
- Validation and duplicate-submit protection.
- Redirects to the product details page after saving.

### 10. Delete Product

- Delete confirmation dialog.
- Accessible dialog behavior.
- Supports both original and session-created products.
- Deleted products are removed from the current session view.

### 11. Loading, Empty & Error States

- Loading indicators.
- Empty states for searches and product lists.
- Error messages with Retry actions.
- Accessible status and alert messaging.

### 12. URL State Management

The URL stores dashboard state such as:

- `page`
- `pageSize`
- `search`
- `category`
- `sort`
- `delay`

Invalid query values are sanitized to safe defaults so direct URLs do not cause application crashes.

## Setup & Installation

### Prerequisites

- Node.js 18.17.0 or higher (Node 20+ recommended)
- npm 9.0.0 or higher

### 1. Clone the repository

```bash
git clone <repository-url>
cd product-admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

No environment variables are required. The application communicates directly with the public DummyJSON API.

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
npm start
```

### 6. Linting

```bash
npm run lint
```

## How to Use

### Login Credentials

Use the DummyJSON demo account:

```text
Username: emilys
Password: emilyspass
```

### Main Workflow

1. Log in using the demo credentials.
2. Browse and paginate through the product catalog.
3. Search for products using the search field.
4. Filter products by category when search is not active.
5. Sort products by price, rating, or title.
6. Open a product to view its details and reviews.
7. Add a new product using the Add Product form.
8. Edit an existing or newly added product.
9. Delete a product and confirm the deletion.
10. Logout using the header logout action.

## API Information

**Base URL:** `https://dummyjson.com`

### Endpoints Used

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | User authentication |
| GET | `/products` | Product listing |
| GET | `/products/search?q={query}` | Product search |
| GET | `/products/categories` | Category list |
| GET | `/products/category/{category}` | Category products |
| GET | `/products/{id}` | Product details |
| POST | `/products/add` | Simulated product creation |
| PUT | `/products/{id}` | Simulated product update |
| DELETE | `/products/{id}` | Simulated product deletion |

## DummyJSON CRUD Limitation

DummyJSON is a mock API. Product additions, updates, and deletions are simulated and are not permanently stored by the API.

Because of this:

- Newly created products do not remain after a hard refresh.
- API-created products may receive IDs that are not available as persistent server records.
- Direct update/delete requests for a session-created product may therefore fail against the mock API.

### Session CRUD Handling

The application uses a `ProductSessionContext` and session overlay to keep CRUD changes available during the current browser session.

The session layer handles:

- Multiple newly added products.
- Session-created product updates.
- Session-created product deletion.
- Original product updates and deletions.
- Merging API results with session changes.
- Session-aware product counts and pagination.

This allows the application to satisfy the assignment's current-session CRUD behavior without pretending that DummyJSON provides permanent persistence.

## Important Implementation Decisions

### Centralized Axios

A shared Axios instance is used for API requests.

It provides:

- Common API configuration.
- Authentication token handling.
- Centralized error processing.
- Consistent handling of unauthorized responses.

### Search Debounce & Cancellation

Search uses a 400ms debounce to avoid unnecessary requests. Previous requests are cancelled with `AbortController`, and request IDs prevent older responses from replacing newer results.

### URL as Source of Truth

Dashboard state is synchronized with URL query parameters so users can refresh or share a URL while retaining the relevant search, filter, sort, and pagination state.

### Session Product Overlay

`ProductSessionContext` stores temporary CRUD changes that cannot be persisted by DummyJSON. Session-added products are kept together rather than replacing previously added products.

## Problems Encountered & Solutions

### Session-Created Product CRUD

**Problem:** DummyJSON does not permanently store products created through `POST /products/add`. The API can return a simulated product ID, which means later direct requests for that product can return `404 Not Found`. Multiple newly added products also required special session handling.

**Solution:** Added a session overlay using `ProductSessionContext`. Session-created products are stored locally during the current session, multiple products are preserved, and view/edit/delete operations use the session data when appropriate.

### Search Race Conditions

**Problem:** A slower earlier search request could finish after a newer search request and replace the latest results.

**Solution:** Added request cancellation with `AbortController` and request sequencing so stale responses are ignored.

## AI Assistance Disclosure

AI coding assistance was used during development for code implementation, debugging, edge-case handling, testing, and documentation. The generated code was reviewed, tested, and adjusted to meet the assignment requirements.

## Verification & Build Results

The project was verified with:

```bash
npm run lint
```

Result:

```text
No ESLint warnings or errors
Exit code: 0
```

Production build was also verified with:

```bash
npx --no-install next build
```

The Next.js production build completed successfully.

## GitHub Repository

**Repository:**  
_https://github.com/Vaishu154/product-admin-dashboard_

## Live Demo

**Live application:**  
_To be added after deployment._

## Notes

DummyJSON CRUD changes are intended for the current application session. They are reset when the application is refreshed because the underlying mock API does not permanently persist these changes.
