# 📚 English Flashcard – Fullstack Web App

Ứng dụng học từ vựng tiếng Anh tương tác, sử dụng hệ thống Flashcard 3D kết hợp tra từ điển tự động, dịch thuật và phân quyền quản trị.

**Stack:** Angular 18 (Frontend) · Spring Boot 3.5 (Backend) · PostgreSQL (Database) · JWT (Auth)

---

## ✨ Tính năng

### Người dùng (User)
- 🔐 Đăng ký / Đăng nhập bảo mật bằng JWT
- 🗂️ Xem danh sách chủ đề từ vựng với thanh tiến độ học
- 🃏 Học từ vựng qua thẻ Flashcard hiệu ứng lật 3D
- 📖 Tra từ điển tự động (phiên âm IPA, audio, loại từ, định nghĩa)
- 🔊 Nghe phát âm chuẩn trực tiếp
- 🌍 Dịch ví dụ & định nghĩa sang tiếng Việt tự động (Google Translate proxy)
- 📊 Theo dõi tiến độ học theo từng chủ đề

### Quản trị viên (Admin)
- 👥 Xem danh sách người dùng, tìm kiếm, phân quyền ADMIN/USER, xóa
- 📝 Quản lý từ vựng: thêm, sửa, xóa flashcard theo từng chủ đề
- 📊 Dashboard thống kê: tổng người dùng, tổng từ vựng
- 🔒 Giao diện Admin Panel riêng biệt, chỉ ADMIN mới truy cập được

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | Angular 18, TypeScript, CSS3 (Standalone Components) |
| Backend | Spring Boot 3.5, Java 17 |
| Database | PostgreSQL 15 |
| Bảo mật | Spring Security 6, JWT (jjwt 0.12.3) |
| ORM | Spring Data JPA / Hibernate |
| Build tool | Maven 3, Node.js / npm |
| API ngoại | Free Dictionary API, Google Translate (proxy) |

---

## 🗂️ Cấu trúc thư mục

```
english-flashcard/
├── english-flashcard-backend/     # Spring Boot API
│   └── src/main/java/com/intern/englishflashcard/
│       ├── config/                # SecurityConfig, JwtAuthFilter
│       ├── controller/            # AuthController, AdminController, ...
│       ├── dto/                   # Request/Response DTOs
│       ├── entity/                # User, Category, Flashcard
│       ├── repository/            # JPA Repositories
│       ├── service/               # AuthService
│       └── util/                  # JwtUtil
├── english-flashcard-frontend/    # Angular SPA
│   └── src/app/
│       ├── components/
│       │   ├── auth/              # Trang đăng nhập / đăng ký
│       │   ├── dashboard/         # Trang chủ người dùng
│       │   ├── flashcard/         # Màn hình học từ 3D
│       │   └── admin/             # Admin Panel (layout, dashboard, users, words)
│       └── services/
│           ├── auth/              # AuthService, authGuard, adminGuard, interceptor
│           ├── api/               # ApiService (categories, flashcards)
│           ├── admin/             # AdminService
│           └── dictionary/        # DictionaryService
├── data.sql                       # DDL schema PostgreSQL
├── api-test.http                  # REST API test file
└── sample-vocabulary.txt          # File từ vựng mẫu
```

---

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu
- Java 17+
- Maven 3.8+
- Node.js 18+ & npm
- PostgreSQL 15+

---

### 1. Tạo Database

Mở pgAdmin hoặc psql và chạy:

```sql
CREATE DATABASE english_flashcard;
```

Sau đó chạy file `data.sql` để tạo schema:

```bash
psql -U postgres -d english_flashcard -f data.sql
```

---

### 2. Chạy Backend

```bash
cd english-flashcard-backend
```

Tạo file cấu hình local (không commit lên git):

```
src/main/resources/application-local.properties
```

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/english_flashcard
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_BASE64_SECRET_KEY
jwt.expiration=86400000
```

Chạy backend:

```bash
# Nếu RAM hạn chế (dưới 4GB):
$env:MAVEN_OPTS="-Xmx256m -Xms64m -XX:+UseSerialGC"
mvn spring-boot:run

# Bình thường:
mvn spring-boot:run
```

> Backend chạy tại `http://localhost:8080`

Khi khởi động lần đầu, hệ thống tự tạo tài khoản admin mặc định:
- **Email:** `admin@gmail.com`
- **Password:** `123456`

---

### 3. Import dữ liệu từ vựng (tùy chọn)

Sau khi backend đang chạy, gọi API import:

```http
POST http://localhost:8080/api/import
```

Hệ thống sẽ đọc file `words.txt` và tự động tạo các chủ đề (50 từ/chủ đề).

---

### 4. Chạy Frontend

```bash
cd english-flashcard-frontend
npm install
ng serve
```

> Frontend chạy tại `http://localhost:4200`

---

## 🔑 API Endpoints

### Authentication (Public)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản mới |
| POST | `/auth/login` | Đăng nhập, nhận JWT token |

**Request body đăng ký:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

**Request body đăng nhập:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "role": "USER"
}
```

---

### Flashcard (Public GET, Auth POST/PUT/DELETE)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/categories` | Lấy danh sách chủ đề |
| GET | `/categories/{id}/flashcards` | Lấy từ vựng theo chủ đề |

---

### Admin (Yêu cầu role ADMIN + Bearer Token)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê tổng users, từ vựng |
| GET | `/api/admin/users` | Danh sách tất cả người dùng |
| PUT | `/api/admin/users/{id}/role` | Đổi role USER/ADMIN |
| DELETE | `/api/admin/users/{id}` | Xóa người dùng |
| POST | `/api/admin/flashcards` | Thêm từ vựng mới |
| PUT | `/api/admin/flashcards/{id}` | Sửa từ vựng |
| DELETE | `/api/admin/flashcards/{id}` | Xóa từ vựng |

**Header bắt buộc cho admin API:**
```
Authorization: Bearer <token>
```

---

### Other

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/user/me` | Thông tin người dùng hiện tại |
| GET | `/api/translate?text=hello&target=vi` | Dịch văn bản |
| POST | `/api/import` | Import từ vựng từ file words.txt |

---

## 🗃️ Database Schema

```sql
-- Người dùng
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',  -- 'USER' | 'ADMIN'
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chủ đề từ vựng
CREATE TABLE categories (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

-- Thẻ từ vựng
CREATE TABLE flashcards (
    id           BIGSERIAL PRIMARY KEY,
    category_id  BIGINT REFERENCES categories(id),
    word         VARCHAR(100),
    meaning      TEXT,
    example      TEXT
);
```

---

## 🔒 Phân quyền

| Role | Quyền truy cập |
|---|---|
| **Guest** | `/auth/login`, `/auth/register` |
| **USER** | Tất cả trang người dùng (`/dashboard`, `/study/*`), đọc categories/flashcards |
| **ADMIN** | Tất cả quyền USER + toàn bộ `/api/admin/**` + Admin Panel (`/admin/*`) |

Phân quyền hoạt động theo cơ chế:
1. Frontend lưu `role` vào `localStorage` sau khi đăng nhập
2. `adminGuard` kiểm tra role trước khi cho vào `/admin/**`
3. Backend verify JWT + role trên mọi request `/api/admin/**`

---

## 🌐 Kiến trúc hệ thống

```
Browser (Angular SPA :4200)
        │  REST API / JSON
        ▼
Spring Boot Backend (:8080)
  ├── SecurityConfig (JWT Filter + CORS)
  ├── AuthController  → AuthService → UserRepository
  ├── AdminController → UserRepo / FlashcardRepo / CategoryRepo
  ├── FlashcardController → FlashcardRepository
  ├── TranslationController → Google Translate API (proxy)
  └── DataImportController → words.txt → DB
        │  JPA/Hibernate
        ▼
PostgreSQL (:5432)
  └── english_flashcard DB
        ├── users
        ├── categories
        └── flashcards
```

---

## 📄 License

MIT License — free to use, modify and distribute.
