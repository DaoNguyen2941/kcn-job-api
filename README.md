# KCN JOB - Backend (System 1: Recruitment / Labor Supply)

Backend cho hệ thống KCN JOB, xây dựng bằng **NestJS + TypeScript + TypeORM + MySQL 8 + Redis**.

Phạm vi: quản lý doanh nghiệp → nhu cầu nhân lực (labor order) → đăng tuyển → người lao động được
cung ứng → tiến độ hoàn thành đơn. Website public cho người tìm việc. Không bao gồm ATS pipeline,
chấm công, payroll, hay Worker Management (dành cho System 2 trong tương lai).

## 1. Yêu cầu môi trường

- Node.js 20+
- MySQL 8 (charset `utf8mb4`, collation `utf8mb4_unicode_ci`)
- Redis 6+

## 2. Cài đặt

```bash
npm install
cp .env.example .env
# Chỉnh .env: DATABASE_*, REDIS_*, JWT_*_SECRET, DEFAULT_ADMIN_PASSWORD...
```

## 3. Migration (schema chuẩn - KHÔNG dùng synchronize)

```bash
# Tạo database trước (ví dụ bằng mysql client):
# CREATE DATABASE kcnjob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

npm run migration:run
```

Migration tạo đầy đủ 11 bảng: `admin_users`, `industrial_zones`, `companies`, `company_contacts`,
`job_categories`, `labor_orders`, `labor_order_requirements`, `recruitment_sources`,
`recruitment_posts`, `candidates`, `labor_order_workers` - kèm PK/FK/index/unique/default values.

Revert nếu cần:

```bash
npm run migration:revert
```

## 4. Seed dữ liệu cơ bản

```bash
npm run seed
```

Tạo:
- Admin user `admin` (password lấy từ `DEFAULT_ADMIN_PASSWORD` trong `.env`, không hard-code)
- 3 khu công nghiệp mẫu (Yên Phong, Quế Võ, Tiên Sơn)
- 8 ngành nghề mẫu (Công nhân, QC, Kho vận, Kỹ thuật, Thợ điện, Lái xe, Bán hàng, Bảo vệ)
- 6 nguồn tuyển mẫu (Facebook, Zalo, Website, TikTok, CTV, Referral)

## 5. Chạy server

```bash
npm run start:dev      # development, watch mode
npm run build && npm run start:prod
```

Server chạy tại `http://localhost:{PORT}/{API_PREFIX}` (mặc định `http://localhost:3000/api`).
Swagger UI: `http://localhost:3000/docs`.

## 6. Kiến trúc & quy ước quan trọng

- **PK**: `BIGINT UNSIGNED AUTO_INCREMENT` cho mọi bảng nghiệp vụ.
- **Timestamps**: `created_at` / `updated_at` (tự động qua TypeORM decorators).
- **`labor_orders` là bảng trung tâm.** Số liệu cung ứng (`supplied`, `started`, `remaining`)
  KHÔNG lưu trực tiếp trên `labor_orders` - luôn được tính từ `labor_order_workers`
  (xem `LaborOrdersService.getProgress`).
- **Candidate không phải lead.** Chỉ tạo `candidates` khi KCN JOB thực sự thu thập thông tin
  người lao động để cung ứng cho doanh nghiệp - không tạo vì xem bài tuyển dụng hay nhắn Zalo/FB.
- **Redis** chỉ dùng cho cache (public job listing/detail, job-categories, industrial-zones,
  dashboard stats) và refresh-token session (`auth:refresh:{adminId}:{tokenId}`).
  Redis KHÔNG BAO GIỜ là nguồn dữ liệu nghiệp vụ chính - MySQL là source of truth.
- **Admin Auth**: JWT access token (ngắn hạn, mặc định 15'), JWT refresh token (dài hạn,
  mặc định 7 ngày) với **refresh token rotation** - hash của refresh token được lưu trong Redis,
  token cũ bị revoke ngay khi rotate hoặc logout.
- **Response envelope** nhất quán: `{ success, message, data, meta? }` cho mọi response
  (xem `TransformInterceptor` / `AllExceptionsFilter`).
- **Pagination**: `page`, `limit` (tối đa 100) cho mọi API danh sách, trả về `meta`
  `{ page, limit, total, totalPages }`.

## 7. Cấu trúc thư mục

```text
src/
├── app.module.ts
├── main.ts
├── config/                 # ConfigModule loader
├── database/               # data-source.ts, database.module.ts, migrations/, seeds/
├── redis/                  # RedisModule / RedisService (ioredis)
├── common/
│   ├── cache/               # CacheKeys, CacheHelperService (invalidation)
│   ├── decorators/          # CurrentAdmin
│   ├── dto/                 # PaginationQueryDto, PaginatedResult
│   ├── enums/                # trạng thái nghiệp vụ dùng chung
│   ├── filters/              # AllExceptionsFilter
│   ├── interceptors/         # TransformInterceptor
│   └── utils/                 # slug/code generator, time parser
└── modules/
    ├── auth/                     # /admin/auth/* (login, refresh, logout, me)
    ├── admin-users/
    ├── industrial-zones/         # /admin/industrial-zones/*
    ├── companies/                # /admin/companies/*
    ├── company-contacts/         # /admin/company-contacts/*
    ├── job-categories/           # /admin/job-categories/*
    ├── labor-orders/             # /admin/labor-orders/* (+ status actions, /progress)
    ├── labor-order-requirements/ # /admin/labor-order-requirements/*
    ├── recruitment-sources/      # /admin/recruitment-sources/*
    ├── recruitment-posts/        # /admin/recruitment-posts/*
    ├── candidates/               # /admin/candidates/*
    ├── labor-order-workers/      # /admin/labor-order-workers/*
    ├── public-jobs/              # /jobs, /jobs/:slug, /job-categories, /industrial-zones
    └── dashboard/                # /admin/dashboard/stats
```

## 8. API tổng quan

### Admin Auth (`/admin/auth`)
- `POST /login` → `{ accessToken, refreshToken }`
- `POST /refresh` → rotate refresh token, trả token mới
- `POST /logout` → revoke session hiện tại (hoặc toàn bộ session nếu không gửi refreshToken)
- `GET /me` → hồ sơ admin hiện tại (yêu cầu Bearer access token)

### Admin CRUD (đều yêu cầu `Authorization: Bearer <accessToken>`)
`/admin/industrial-zones`, `/admin/companies`, `/admin/company-contacts`,
`/admin/job-categories`, `/admin/labor-orders` (+ `/:id/confirm`, `/:id/start-recruiting`,
`/:id/pause`, `/:id/resume`, `/:id/close`, `/:id/cancel`, `/:id/progress`),
`/admin/labor-order-requirements`, `/admin/recruitment-sources`, `/admin/recruitment-posts`,
`/admin/candidates`, `/admin/labor-order-workers`, `/admin/dashboard/stats`.

### Public (không cần token, có cache Redis)
- `GET /jobs` - filter: `keyword`, `job_category_id`, `province`, `district`,
  `industrial_zone_id`, `salary_min`, `salary_max`, `employment_type`, `work_shift`, `gender`
  + `page`, `limit`, `sortBy`, `sortOrder`
- `GET /jobs/:slug`
- `GET /job-categories`
- `GET /industrial-zones`

Toàn bộ đường dẫn trên có prefix `API_PREFIX` (mặc định `api`), ví dụ thực tế:
`GET http://localhost:3000/api/jobs`.

## 9. Trạng thái Labor Order

```
DRAFT → CONFIRMED → RECRUITING ⇄ PAUSED
                         ↓
                 PARTIALLY_FILLED → FULFILLED → CLOSED
(CANCELLED có thể xảy ra từ hầu hết các trạng thái đang mở)
```

`RECRUITING` / `PARTIALLY_FILLED` / `FULFILLED` được tự động đồng bộ mỗi khi
`labor_order_workers` thay đổi (xem `LaborOrdersService.syncStatusFromProgress`),
song admin vẫn có thể chủ động gọi các action (`confirm`, `pause`, `resume`, `close`, `cancel`).

## 10. Việc chưa triển khai (đúng theo phạm vi V1)

Không có: ATS pipeline (application/interview/offer), campaign, chấm công, payroll, GPS/tìm việc
gần nhà, Worker Management. Các phần này thuộc System 2 trong tương lai.
