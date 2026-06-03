# 📚 FlashCard English (Fullstack Web App)

Một nền tảng học từ vựng tiếng Anh tương tác và hiệu quả, sử dụng hệ thống flashcard thông minh kết hợp với từ điển và dịch tự động. 

Dự án bao gồm Frontend xây dựng bằng **Angular 18** (giao diện Sáng, Glassmorphism, 3D Flip Card) và Backend xây dựng bằng **Java Spring Boot**.

---

## ✨ Tính năng nổi bật

- 🔐 **Xác thực người dùng:** Đăng ký, Đăng nhập với hệ thống bảo mật JWT (JSON Web Token).
- 🗂️ **Quản lý Chủ đề:** Danh sách các chủ đề từ vựng (Ví dụ: 1000 từ vựng cơ bản, Giao tiếp hàng ngày,...) được phân loại trực quan.
- 🃏 **Thẻ Flashcard 3D:** Hiệu ứng lật thẻ 3D mượt mà để học từ vựng (Mặt trước: Tiếng Anh, Mặt sau: Tiếng Việt).
- 📖 **Tích hợp Từ điển Thông minh:** 
  - Tự động lấy **Phiên âm (Phonetic)** và **Audio phát âm** chuẩn.
  - Lấy Loại từ (Danh từ, Động từ,...), Định nghĩa và Ví dụ minh họa.
- 🌍 **Dịch tự động (Translation Proxy):** Hệ thống backend làm proxy gọi Google Translate API, tự động dịch các ví dụ và định nghĩa sang tiếng Việt để hỗ trợ người dùng.
- 🎨 **Giao diện Hiện đại (Light Theme):** Thiết kế tối giản, đẹp mắt, responsive trên mọi thiết bị.

---

## 🛠️ Công nghệ sử dụng

### Frontend (Client-side)
- **Framework:** Angular 18 (Standalone Components)
- **Ngôn ngữ:** TypeScript, HTML5, CSS3
- **Thư viện/Công cụ:** RxJS, Angular HttpClient, CSS Animations/Transitions
- **API Ngoại:** Free Dictionary API (api.dictionaryapi.dev)

### Backend (Server-side)
- **Framework:** Spring Boot 3
- **Ngôn ngữ:** Java
- **Bảo mật:** Spring Security, JWT Auth
- **Cơ sở dữ liệu:** H2 Database (Hoặc cấu hình linh hoạt sang MySQL/PostgreSQL)
- **ORM:** Spring Data JPA / Hibernate

---

## 🚀 Hướng dẫn cài đặt và chạy cục bộ

### 1. Chạy Backend (Spring Boot)

Yêu cầu: Đã cài đặt **Java 17+** và **Maven**.

1. Di chuyển vào thư mục backend:
   ```bash
   cd english-flashcard-backend
   ```
2. Chạy ứng dụng bằng Maven:
   ```bash
   mvn spring-boot:run
   ```
   > Backend sẽ chạy trên port `http://localhost:8080`.

3. **(Tùy chọn) Nạp dữ liệu mẫu:**
   Mở file `test.http` trong thư mục gốc và gửi request `POST http://localhost:8080/api/import` để backend tự động nạp danh sách từ vựng từ file `words.txt` vào cơ sở dữ liệu.

### 2. Chạy Frontend (Angular)

Yêu cầu: Đã cài đặt **Node.js** và **Angular CLI**.

1. Di chuyển vào thư mục frontend:
   ```bash
   cd english-flashcard-frontend
   ```
2. Cài đặt các thư viện (nếu chưa cài):
   ```bash
   npm install
   ```
   *Lưu ý: Nếu thiếu package `zone.js`, hãy chạy `npm install zone.js`.*
3. Khởi động server phát triển:
   ```bash
   ng serve
   ```
   > Frontend sẽ chạy trên port `http://localhost:4200`.

---

## 📸 Ảnh chụp màn hình (Screenshots)


- Giao diện Đăng nhập / Đăng ký
![alt text](image.png)
![alt text](image-1.png)
- Màn hình Dashboard danh sách bài học
![alt text](image-2.png)
- Giao diện Lật thẻ 3D (Mặt trước / Mặt sau)
![alt text](image-3.png)
![alt text](image-4.png)
---

## 📄 Giấy phép (License)
Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin chi tiết.