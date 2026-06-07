# 📦 Product Management System

> A full-stack web application for managing product inventory — built with **Spring Boot 3** (Java 17) on the backend and **React 18 + Vite + Tailwind CSS** on the frontend. Packaged with **Docker** and **Docker Compose** for one-command deployment.

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Project Structure](#-project-structure)
6. [Backend Deep Dive](#-backend-deep-dive)
7. [Frontend Deep Dive](#-frontend-deep-dive)
8. [Data Flow & Sequence Diagrams](#-data-flow--sequence-diagrams)
9. [REST API Reference](#-rest-api-reference)
10. [Data Model](#-data-model)
11. [User Manual](#-user-manual)
12. [Developer Manual (Local Setup)](#-developer-manual-local-setup)
13. [Docker Deployment](#-docker-deployment)
14. [CI/CD Pipeline](#-cicd-pipeline)
15. [Testing](#-testing)
16. [Environment Variables](#-environment-variables)
17. [Troubleshooting](#-troubleshooting)
18. [Roadmap & Contributing](#-roadmap--contributing)
19. [License](#-license)

---

## 🌍 Overview

The **Product Management System** is a self-contained reference application that demonstrates how to build a modern, type-safe, container-ready CRUD application end-to-end. It is intentionally small enough to read in one sitting, and covers validation, mapping, pagination, error handling, observability, and a live CI pipeline.

**What it solves:** A small business or developer needs a no-fuss inventory dashboard with the ability to add, edit, delete, search, filter, and export products. The system exposes a REST API that the React SPA consumes, and is shipped as two containers that talk over a private Docker network.

---

## ✨ Key Features

| Category | Feature |
|---|---|
| **Inventory** | Create, read, update, delete (CRUD) products |
| **Search** | Case-insensitive search by name **or** category |
| **Filtering** | Filter by category, by price range, by low stock |
| **Pagination** | Server-side pagination with configurable page size (5/10/20/50) |
| **Sorting** | Multi-column sortable table (id, name, category, price, quantity, createdAt) |
| **Dashboard** | Real-time KPIs: total products, categories, quantity, inventory value, low-stock alerts |
| **Export** | One-click **CSV export** of the entire catalog |
| **Validation** | Bean Validation (JSR-380) on the server + Zod schemas on the client |
| **Error UX** | Centralized `GlobalExceptionHandler` returns typed error payloads; client surfaces them as toasts |
| **State** | TanStack Query (React Query) with cache invalidation on every mutation |
| **Theming** | Light / Dark mode with `localStorage` persistence and `prefers-color-scheme` detection |
| **Responsive** | Mobile-first layout — sidebar collapses into a hamburger menu on small screens |
| **Observability** | SLF4J logging on every controller, Spring Actuator `/actuator/health` |
| **Docs** | Interactive **Swagger UI** at `/swagger-ui.html` |
| **DevOps** | Multi-stage Dockerfiles, Docker Compose, GitHub Actions CI + Trivy security scan |

---

## 🛠️ Technology Stack

### Backend
| Layer | Technology | Why |
|---|---|---|
| Language | **Java 17** | LTS release, records, sealed classes, pattern matching |
| Framework | **Spring Boot 3.2** | Auto-config, starter ecosystem, actuator |
| Persistence | **Spring Data JPA + Hibernate** | Repository abstraction, derived queries |
| Database | **H2 (in-memory)** | Zero-config dev DB; swap to Postgres by changing 4 lines of YAML |
| Validation | **Hibernate Validator (JSR-380)** | Declarative field-level validation |
| Mapping | **MapStruct 1.5.5** | Compile-time DTO ↔ Entity mappers, zero reflection |
| Docs | **springdoc-openapi 2.2.0** | Swagger UI from annotations |
| Build | **Maven 3 + `mvnw`** | Reproducible builds |

### Frontend
| Layer | Technology | Why |
|---|---|---|
| Framework | **React 18** | Hooks, concurrent rendering, huge ecosystem |
| Build Tool | **Vite 5** | Instant HMR, ESM-native, fast prod builds |
| Styling | **Tailwind CSS 3** | Utility-first CSS, small minified output |
| Components | **shadcn/ui + Radix UI** | Accessible, unstyled primitives — we own the markup |
| Server State | **TanStack Query 5** | Caching, refetching, optimistic updates, devtools |
| Forms | **React Hook Form + Zod** | Performant, type-safe form validation |
| Routing | **React Router 6** | Standard SPA routing |
| HTTP | **Axios** | Interceptors for logging & error normalization |
| Toasts | **Sonner** | Minimal, themeable notifications |
| Icons | **lucide-react** | Tree-shakeable SVG icons |
| Testing | **Vitest + Testing Library** | Native Vite test runner |

### DevOps
- **Docker** with multi-stage builds (small final images, non-root user)
- **Docker Compose** for local orchestration
- **GitHub Actions** for CI (lint, test, build, docker build, Trivy scan)
- **nginx** as the frontend web server in the Docker image (with gzip, security headers, API proxy)

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                          User's Browser                           │
│  React 18 SPA  (Vite dev server :3000  /  nginx :3000 in prod)    │
└─────────────────────┬──────────────────────────────────────────────┘
                      │  HTTPS / HTTP  (Axios)
                      │  CORS: allowed origin = http://localhost:3000
                      ▼
┌────────────────────────────────────────────────────────────────────┐
│              Frontend  (Docker container : 3000)                   │
│  nginx  ──►  static React build  ──►  /api/* proxied to backend   │
└─────────────────────┬──────────────────────────────────────────────┘
                      │  http://backend:8080
                      ▼
┌────────────────────────────────────────────────────────────────────┐
│            Backend  (Docker container : 8080)                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Spring MVC   →   ProductController (REST)                   │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  ProductService   (business logic, @Transactional)          │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  ProductRepository  (Spring Data JPA)                       │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Hibernate  ──►  H2 in-memory DB  (jdbc:h2:mem:productdb)   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Cross-cutting:                                                     │
│   • GlobalExceptionHandler   • MapStruct   • springdoc-openapi      │
│   • SLF4J logging            • Bean Validation   • CORS filter     │
└────────────────────────────────────────────────────────────────────┘
```

**Architectural choices, briefly justified:**
- **Layered architecture** (Controller → Service → Repository) keeps concerns separate and unit-testable.
- **DTOs everywhere** — the entity never leaks to the wire, and vice versa. MapStruct generates the mapping code at compile time.
- **In-memory H2** for the demo, but the entire persistence layer is decoupled behind `JpaRepository`, so swapping to MySQL/Postgres is a 4-line `application.yml` change.
- **The frontend owns no business state**; React Query is the single source of truth, and the cache is invalidated on every successful mutation.

---

## 📁 Project Structure

```
Fulll-Stack-Java-React-Application/
├── backend/                                  # Spring Boot service
│   ├── src/main/java/com/productmanagement/
│   │   ├── ProductManagementApplication.java # @SpringBootApplication entry point
│   │   ├── config/
│   │   │   ├── OpenApiConfig.java            # Swagger metadata
│   │   │   └── WebConfig.java                # CORS mapping
│   │   ├── controller/
│   │   │   └── ProductController.java        # All REST endpoints
│   │   ├── service/
│   │   │   ├── ProductService.java           # Business logic
│   │   │   └── CsvExportService.java         # CSV streaming
│   │   ├── repository/
│   │   │   └── ProductRepository.java        # JPA + custom @Query
│   │   ├── entity/
│   │   │   └── Product.java                  # JPA @Entity
│   │   ├── dto/
│   │   │   ├── ProductDto.java               # Wire format
│   │   │   ├── PagedResponse.java            # Generic paged wrapper
│   │   │   └── DashboardStatsDto.java
│   │   ├── mapper/
│   │   │   └── ProductMapper.java            # MapStruct interface
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java   # @RestControllerAdvice
│   │       └── ResourceNotFoundException.java
│   ├── src/main/resources/
│   │   ├── application.yml                   # Default profile
│   │   └── application-docker.yml            # Docker profile overrides
│   ├── src/test/                             # JUnit 5 + Spring Boot Test
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd / .mvn/
│   └── Dockerfile                            # Multi-stage build
│
├── frontend/                                 # React SPA
│   ├── src/
│   │   ├── main.jsx                          # ReactDOM root
│   │   ├── App.jsx                           # Router + providers
│   │   ├── index.css                         # Tailwind layers
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx                 # KPIs & low-stock
│   │   │   ├── Products.jsx                  # CRUD table
│   │   │   └── NotFound.jsx                  # 404
│   │   ├── components/
│   │   │   ├── Layout.jsx                    # Header / nav / footer
│   │   │   ├── ProductTable.jsx              # Sortable paged table
│   │   │   ├── ProductDialog.jsx             # Create / edit modal
│   │   │   ├── DeleteConfirmDialog.jsx
│   │   │   ├── TableSkeleton.jsx             # Loading state
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── ui/                           # shadcn primitives
│   │   ├── hooks/
│   │   │   └── useProducts.js                # All React Query hooks
│   │   ├── services/
│   │   │   └── api.js                        # Axios + productApi
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx              # Dark mode provider
│   │   ├── lib/utils.js                      # cn(), formatters, debounce
│   │   └── test/setup.js                     # Vitest setup
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                        # @ → /src alias, proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── nginx.conf                            # Prod nginx config
│   └── Dockerfile                            # Build → nginx
│
├── .github/workflows/build.yml               # CI: test, build, scan
├── docker-compose.yml                        # One-command stack
├── README.md
├── plan.md
└── .gitignore
```

---

## 🔍 Backend Deep Dive

### 1. Entry Point — [`ProductManagementApplication.java`](backend/src/main/java/com/productmanagement/ProductManagementApplication.java)
```java
@SpringBootApplication
public class ProductManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductManagementApplication.class, args);
    }
}
```
The `@SpringBootApplication` annotation triggers auto-configuration and component scanning of the `com.productmanagement` package.

### 2. Entity — [`Product.java`](backend/src/main/java/com/productmanagement/entity/Product.java)
A standard JPA entity with:
- `@Id @GeneratedValue(IDENTITY)` for auto-increment primary key.
- **Bean Validation** annotations (`@NotBlank`, `@Size`, `@DecimalMin`, `@Min`, `@Digits`) — Spring throws `MethodArgumentNotValidException` if violated.
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) — auto-populate `createdAt` / `updatedAt`.
- Big decimal money (`BigDecimal` with `precision=12, scale=2`).

### 3. Repository — [`ProductRepository.java`](backend/src/main/java/com/productmanagement/repository/ProductRepository.java)
Extends `JpaRepository<Product, Long>` and adds:
- **Derived query**: `findByCategoryIgnoreCase`, `findByPriceBetween`, `findByQuantityLessThan`
- **`@Query` JPQL**: case-insensitive search by name OR category, distinct categories, count, sum, and inventory value computation.

### 4. DTOs
- `ProductDto` — wire format with the same validation annotations as the entity.
- `PagedResponse<T>` — generic envelope: `{ content, page, size, totalElements, totalPages, first, last, empty }`. This decouples the client from Spring's `Page` JSON shape.
- `DashboardStatsDto` — four-number payload: `totalProducts, totalCategories, totalQuantity, inventoryValue`.

### 5. Mapper — [`ProductMapper.java`](backend/src/main/java/com/productmanagement/mapper/ProductMapper.java)
```java
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    ProductDto toDto(Product product);
    Product   toEntity(ProductDto dto);
    List<ProductDto> toDtoList(List<Product> products);
    void updateProductFromDto(ProductDto dto, @MappingTarget Product product);
}
```
MapStruct generates the implementation at compile time. `IGNORE` means partial updates don't blank out fields with `null` values.

### 6. Service — [`ProductService.java`](backend/src/main/java/com/productmanagement/service/ProductService.java)
`@Transactional` class with read-only transactional overrides for queries. Responsibilities:
- Build `Pageable` from `page, size, sortBy, sortDir`.
- Decide between `findAll` and the search query.
- Map `Page<Product>` → `PagedResponse<ProductDto>`.
- Throw `ResourceNotFoundException` when an ID is unknown (consumed by the global handler → 404).

### 7. CSV Service — [`CsvExportService.java`](backend/src/main/java/com/productmanagement/service/CsvExportService.java)
Streams a `text/csv` response using `HttpServletResponse#getWriter()`. Escapes double quotes (`"` → `""`) so commas and newlines in product names don't break the file.

### 8. Controller — [`ProductController.java`](backend/src/main/java/com/productmanagement/controller/ProductController.java)
`@RestController` mounted at `/api/v1/products`. Every method is annotated with `@Operation` / `@ApiResponses` for Swagger. Logs every request via SLF4J.

### 9. Exception Handling — [`GlobalExceptionHandler.java`](backend/src/main/java/com/productmanagement/exception/GlobalExceptionHandler.java)
`@RestControllerAdvice` with four handlers:

| Exception | HTTP Status | Response Shape |
|---|---|---|
| `ResourceNotFoundException` | 404 | `ErrorResponse` |
| `MethodArgumentNotValidException` | 400 | `ValidationErrorResponse` (per-field map) |
| `IllegalArgumentException` | 400 | `ErrorResponse` |
| `Exception` (catch-all) | 500 | `ErrorResponse` with generic message |

### 10. Configuration
- **`OpenApiConfig`** — sets the title, version, contact, license in the Swagger spec.
- **`WebConfig`** — explicit CORS mapping for `/api/**`, allowing the dev frontend on `:3000`.
- **`application.yml`** — H2 in-memory, JPA `create-drop`, CORS, logging, Actuator, Springdoc paths.
- **`application-docker.yml`** — overrides for the containerized profile (used in `docker-compose`).

### 11. Maven (`pom.xml`)
Key dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `h2`, `mapstruct`, `mapstruct-processor` (annotation processor), `springdoc-openapi-starter-webmvc-ui`, `spring-boot-devtools`, `spring-boot-starter-test`.

---

## 🎨 Frontend Deep Dive

### 1. Bootstrapping — [`main.jsx`](frontend/src/main.jsx) & [`App.jsx`](frontend/src/App.jsx)
Provider stack from outer to inner:
1. `QueryClientProvider` (TanStack Query) — single global cache.
2. `ThemeProvider` — light/dark/system theme.
3. `BrowserRouter` — `react-router-dom`.
4. `Layout` — page chrome.
5. `<Routes>` — three pages (`Dashboard`, `Products`, `NotFound`).
6. `Toaster` (Sonner) and `ReactQueryDevtools` floating in the corner.

Default query options: 1 retry, no refetch-on-window-focus, 5-minute `staleTime`.

### 2. Service Layer — [`src/services/api.js`](frontend/src/services/api.js)
A single `axios` instance with:
- `baseURL` from `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api/v1`).
- **Request interceptor** — logs method + URL.
- **Response interceptor** — logs status, normalizes errors.
- 10-second timeout.

The `productApi` object exposes 10 functions, one per backend endpoint, returning typed promises.

### 3. React Query Hooks — [`src/hooks/useProducts.js`](frontend/src/hooks/useProducts.js)
Every backend operation is wrapped in a hook:

| Hook | Type | Behavior |
|---|---|---|
| `useProducts(params)` | Query | `keepPreviousData: true` (no flash on page change), 5-min stale time |
| `useProduct(id)` | Query | Enabled only if `id` is truthy |
| `useCategories()` | Query | 10-min stale time (changes rarely) |
| `useDashboardStats()` | Query | **Auto-refetches every 30 s** |
| `useLowStockProducts(threshold)` | Query | 5-min stale time |
| `useCreateProduct()` | Mutation | Invalidates `products`, `dashboardStats`, `categories` on success |
| `useUpdateProduct()` | Mutation | Updates single-product cache, invalidates lists |
| `useDeleteProduct()` | Mutation | Removes product from cache, invalidates lists |
| `useExportProducts()` | Mutation | Returns a `Blob`, triggers browser download via a synthetic `<a>` click |

All mutations surface success/failure toasts via Sonner.

### 4. Routing & Layout — [`Layout.jsx`](frontend/src/components/Layout.jsx)
Sticky header with logo, desktop nav links, theme toggle, and a hamburger button for mobile. Active link is highlighted. Footer is rendered with copyright.

### 5. Pages
- **Dashboard** ([`pages/Dashboard.jsx`](frontend/src/pages/Dashboard.jsx)) — four KPI cards (Total Products, Categories, Total Quantity, Inventory Value) and a Low-Stock Alert panel showing the top 5 products under threshold.
- **Products** ([`pages/Products.jsx`](frontend/src/pages/Products.jsx)) — debounced search (300 ms), header buttons (Export CSV, Add Product), the `ProductTable`, and modal dialogs for create/edit/delete.
- **NotFound** — fallback 404.

### 6. Components
- **ProductTable** — sortable headers (id, name, category, price, quantity, createdAt), quantity badge color-coded by stock level, pagination controls (page size + Prev/Next), `TableSkeleton` while loading, `EmptyState` when no rows.
- **ProductDialog** — controlled by `mode: 'create' | 'edit'`. Uses React Hook Form + Zod schema identical to the server validation. Category is a `Select` populated by `useCategories()` plus a free-text input.
- **DeleteConfirmDialog** — confirm-before-delete with a loading state on the confirm button.
- **TableSkeleton** — shimmer placeholder rows.
- **ThemeToggle** — cycles light → dark → system.

### 7. UI Primitives (`components/ui/*`)
shadcn/ui-style components built on Radix UI: `button`, `input`, `label`, `select`, `dialog`, `card`, `table`, `badge`, `alert`, `textarea`, `switch`. All are styled with Tailwind using CSS variables for the design tokens.

### 8. Styling
- `tailwind.config.js` — scans `src/**/*.{js,jsx}`, enables `darkMode: ["class"]`, registers a Tailwind color system bound to CSS variables.
- `index.css` — defines `:root` and `.dark` design tokens (HSL), sets up the `body` background, and registers Tailwind's `base/components/utilities` layers.

### 9. Build Configuration — [`vite.config.js`](frontend/vite.config.js)
- React plugin, path alias `@` → `./src`.
- Dev server on port 3000 with `/api` proxied to `http://localhost:8080`.
- Vitest pre-configured with `jsdom` and `./src/test/setup.js`.

### 10. Docker Build
`npm run build` → `dist/`. The Dockerfile copies `dist/` into `nginx:alpine`, mounts our custom `nginx.conf` (gzip, security headers, cache control, `/api` reverse proxy to `http://backend:8080/api/`, health endpoint).

---

## 🔁 Data Flow & Sequence Diagrams

### A. List products with search
```
User types in search box
       │
       ▼ (debounced 300 ms)
Products.jsx  ────  useProducts({ page, size, sortBy, sortDir, search })
       │
       ▼  GET /api/v1/products?page=0&size=10&sortBy=name&sortDir=asc&search=laptop
api.js (axios)
       │
       ▼
ProductController.getAllProducts
       │
       ▼
ProductService.getAllProducts  →  builds Pageable, picks query
       │
       ▼
ProductRepository.findByNameOrCategoryContainingIgnoreCase
       │
       ▼
Hibernate  →  H2  →  rows
       │
       ▼
MapStruct.toDtoList
       │
       ▼
PagedResponse<ProductDto>  (JSON)
       │
       ▼
React Query cache  →  Products.jsx re-renders table
```

### B. Create product
```
User clicks "Add Product" → opens ProductDialog
       │
       ▼  fills form → React Hook Form validates with Zod
onSubmit()
       │
       ▼  POST /api/v1/products  { name, category, price, quantity, description }
api.js
       │
       ▼
ProductController.createProduct   (@Valid triggers Bean Validation)
       │
       ▼
ProductService.createProduct
       │  ProductMapper.toEntity
       │  productRepository.save
       ▼
Hibernate INSERT → H2
       │
       ▼  saved entity → toDto → ProductDto (201 Created)
       │
       ▼
useCreateProduct onSuccess
       ├─► invalidates 'products'         (re-fetch list)
       ├─► invalidates 'dashboardStats'   (re-compute KPIs)
       └─► invalidates 'categories'       (new category may appear)
       │
       ▼
Sonner toast  "Product created successfully!"
       │
       ▼
Dialog closes, table refreshes.
```

### C. CSV export
```
User clicks "Export CSV" → useExportProducts
       │
       ▼  GET /api/v1/products/export/csv  (responseType: 'blob')
ProductController.exportProductsToCSV
       │
       ▼
ProductService.getAllProductsForExport  (fetches ALL products, sorted)
       │
       ▼
CsvExportService.exportProductsToCSV
   - sets Content-Type: text/csv
   - sets Content-Disposition: attachment; filename="products.csv"
   - writes header + each row (with CSV escaping)
       │
       ▼  Blob
Mutation onSuccess
   - creates object URL
   - creates hidden <a download="products.csv">
   - clicks it → browser saves file
   - revokes object URL
       │
       ▼
Sonner toast  "Products exported successfully!"
```

---

## 📚 REST API Reference

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/products` | List products (paged) | `page, size, sortBy, sortDir, search` |
| `GET` | `/products/{id}` | Get one product | — |
| `POST` | `/products` | Create product | body: `ProductDto` |
| `PUT` | `/products/{id}` | Update product | body: `ProductDto` |
| `DELETE` | `/products/{id}` | Delete product | — |
| `GET` | `/products/category/{category}` | Filter by category | `page, size, sortBy, sortDir` |
| `GET` | `/products/price-range` | Filter by price | `minPrice, maxPrice, page, size, sortBy, sortDir` |
| `GET` | `/products/categories` | Distinct categories | — |
| `GET` | `/products/low-stock` | Stock under threshold | `threshold` (default 10) |
| `GET` | `/products/dashboard` | KPIs | — |
| `GET` | `/products/export/csv` | CSV download | — |

### Standard error envelope
```json
{
  "status": 404,
  "error": "Resource Not Found",
  "message": "Product not found with id: 99",
  "path": "uri=/api/v1/products/99",
  "timestamp": "2024-08-15T10:23:11.456"
}
```

For 400 validation failures, an extra `fieldErrors` map is included:
```json
{
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "fieldErrors": {
    "name": "Product name is required",
    "price": "Price must be greater than 0"
  }
}
```

### Interactive docs
- Swagger UI: <http://localhost:8080/swagger-ui.html>
- OpenAPI JSON: <http://localhost:8080/api-docs>

---

## 🗄️ Data Model

### `products` table
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, auto-increment |
| `name` | VARCHAR(100) | NOT NULL, length 2–100 |
| `category` | VARCHAR(50) | NOT NULL, length 2–50 |
| `price` | DECIMAL(12,2) | NOT NULL, > 0, ≤ 10 integer digits |
| `quantity` | INT | NOT NULL, ≥ 0 |
| `description` | VARCHAR(500) | nullable |
| `created_at` | TIMESTAMP | NOT NULL, auto-set on insert |
| `updated_at` | TIMESTAMP | NOT NULL, auto-set on update |

```mermaid
erDiagram
    PRODUCTS {
        BIGINT id PK
        VARCHAR(100) name
        VARCHAR(50) category
        DECIMAL(12,2) price
        INT quantity
        VARCHAR(500) description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

---

## 📖 User Manual

### 1. Browsing the dashboard
- Open <http://localhost:3000>.
- The dashboard shows four KPIs and a Low-Stock alert. The KPIs auto-refresh every 30 seconds.

### 2. Searching & sorting products
- Click **Products** in the nav.
- Type in the search box — results refresh 300 ms after you stop typing.
- Click a column header (`ID`, `Name`, `Category`, `Price`, `Quantity`, `Created`) to sort. Click again to reverse. Arrows indicate the active sort.

### 3. Adding a product
- Click **Add Product**.
- Fill in **Name** (2–100 chars), **Category** (2–50 chars), **Price** (positive number, ≤ 2 decimals), **Quantity** (non-negative integer), **Description** (optional, ≤ 500 chars).
- Click **Create Product**. The list updates and a success toast appears.

### 4. Editing a product
- Click the pencil icon in a row.
- Modify fields and click **Update Product**.

### 5. Deleting a product
- Click the trash icon in a row.
- Confirm in the dialog.

### 6. Exporting to CSV
- Click **Export CSV** at the top of the Products page. A `products.csv` file is downloaded with all products, sorted by ID.

### 7. Toggling dark mode
- Click the moon/sun icon in the top-right. Your preference persists in `localStorage`.

### 8. Pagination
- Use the **Rows per page** selector (5/10/20/50) and **Previous** / **Next** buttons at the bottom of the table.

---

## 🧑‍💻 Developer Manual (Local Setup)

### Prerequisites
| Tool | Version | Check |
|---|---|---|
| **JDK** | 17+ | `java -version` |
| **Maven** | 3.8+ (or use the bundled `mvnw`) | `mvn -v` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |

> **No Maven install required** — both `mvnw` (Unix) and `mvnw.cmd` (Windows) are included.

### Option A — Run everything by hand (best for development)

Open **two terminals**.

**Terminal 1 — Backend**
```bash
cd backend
./mvnw spring-boot:run          # Linux / macOS
# or
mvnw.cmd spring-boot:run        # Windows
```
- API listens on <http://localhost:8080>
- Swagger: <http://localhost:8080/swagger-ui.html>
- H2 Console: <http://localhost:8080/h2-console>  (JDBC URL: `jdbc:h2:mem:productdb`, user: `sa`, pass: `password`)

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```
- App opens at <http://localhost:3000>
- Vite's dev server proxies `/api/*` to the backend, so CORS is bypassed in dev.

### Option B — One command with Docker Compose
```bash
docker-compose up --build
```
- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8080>
- The frontend container's nginx proxies `/api/*` to the backend container, so a single origin is exposed to the browser.

### Tear down
```bash
docker-compose down            # stop
docker-compose down -v         # stop + remove volumes
```

---

## 🐳 Docker Deployment

### Backend image — [`backend/Dockerfile`](backend/Dockerfile)
- **Build stage**: `openjdk:17-jdk-slim`, caches Maven dependencies, compiles with `./mvnw clean package -DskipTests`.
- **Runtime stage**: `openjdk:17-jre-slim` (smaller), installs `curl` for healthcheck, creates a non-root `appuser`, copies the jar, sets `ENTRYPOINT ["java", "-jar", "app.jar"]`.
- Exposes `8080`, healthcheck on `/actuator/health`.

### Frontend image — [`frontend/Dockerfile`](frontend/Dockerfile)
- **Build stage**: `node:18-alpine`, `npm ci` for reproducible installs, `npm run build`.
- **Runtime stage**: `nginx:alpine` with our custom `nginx.conf`, owned by the `nginx` user.
- Exposes `3000`, healthcheck on `/health`.

### Compose — [`docker-compose.yml`](docker-compose.yml)
- Two services on a private bridge network (`product-network`).
- `backend` starts first, `frontend` waits for `service_healthy` (`condition: service_healthy`).
- A named volume `backend_data` mounts on `/app/data` for any future file persistence.

### Push to a registry
```bash
docker tag product-management-backend   your-registry/product-management-backend:1.0
docker tag product-management-frontend  your-registry/product-management-frontend:1.0
docker push your-registry/product-management-backend:1.0
docker push your-registry/product-management-frontend:1.0
```

---

## ⚙️ CI/CD Pipeline

File: [`.github/workflows/build.yml`](.github/workflows/build.yml)

| Job | Trigger | What it does |
|---|---|---|
| `backend-test` | push to `main`/`develop`, PR to `main` | Sets up JDK 17, caches `~/.m2`, runs `./mvnw clean verify`, generates JaCoCo coverage, uploads to Codecov |
| `frontend-test` | same | Sets up Node 18, `npm ci`, runs `lint` + `vitest`, builds the app, uploads `dist/` artifact |
| `docker-build` | only on push to `main` | Builds both Docker images with `docker/build-push-action` and GHA cache (does not push) |
| `security-scan` | every push/PR | Runs **Trivy** filesystem scan, uploads SARIF to GitHub Code Scanning |

---

## 🧪 Testing

### Backend
```bash
cd backend
./mvnw test                # run unit + slice tests
./mvnw verify              # full lifecycle incl. integration tests
./mvnw jacoco:report      # coverage report at target/site/jacoco/index.html
```

### Frontend
```bash
cd frontend
npm run lint               # ESLint
npm test                   # Vitest in watch mode
npm run test:ui            # Vitest with the visual UI
```

---

## 🔐 Environment Variables

### Backend
All values are set in `application.yml` / `application-docker.yml`. Override at runtime with standard Spring env vars, e.g.:

| Variable | Default | Purpose |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | (none) | Switch between `default` and `docker` profiles |
| `SPRING_DATASOURCE_URL` | `jdbc:h2:mem:productdb` | DB connection string |
| `SPRING_DATASOURCE_USERNAME` | `sa` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | `password` | DB password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `create-drop` | Schema strategy |
| `SPRING_H2_CONSOLE_ENABLED` | `true` | Enable `/h2-console` |

### Frontend
| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend base URL (injected at build time) |

To change it, create `frontend/.env`:
```
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## 🛟 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `port 8080 already in use` | Another process on 8080 | Stop the other process or change `server.port` in `application.yml` |
| `port 3000 already in use` | Another process on 3000 | Stop it or change `server.port` in `vite.config.js` |
| CORS error in browser console | Frontend running on a port other than 3000 | Update `allowedOrigins` in `WebConfig.java` and `application.yml` |
| `Failed to load products` toast | Backend not running | Start backend first (`./mvnw spring-boot:run`) |
| `npm install` fails with `EACCES` | Permission issue | Use `npm ci` (clean install) or fix npm prefix perms |
| Docker build fails on `mvnw permission` | File lost executable bit on Windows clone | Run `git update-index --chmod=+x backend/mvnw` then rebuild |
| H2 console not opening | Disabled in profile | Set `spring.h2.console.enabled=true` |
| Swagger UI shows 404 | Wrong path | Use `/swagger-ui.html` (not `/swagger-ui/`) |

---

## 🧭 Roadmap & Contributing

Planned enhancements:
- 🔐 Spring Security + JWT auth (user accounts, RBAC)
- 🐘 PostgreSQL profile (persistent DB)
- 📦 Multi-product CSV import
- 🖼️ Image upload per product (S3-compatible storage)
- 📊 Historical charts on the dashboard
- 🌐 i18n (English / Spanish / Hindi)
- ✅ Full E2E tests with Playwright

**Contributions are welcome.** Fork → feature branch → PR against `main`. Please keep PRs focused, run the linters, and add tests for new behavior.

---

> Built with ❤️ using Spring Boot, React, Tailwind, and Docker. If you found this useful, ⭐ the repo and share it!
