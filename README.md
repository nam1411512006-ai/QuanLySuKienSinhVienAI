# QuanLySuKienSinhVienAI

## 1. Giới thiệu

**QuanLySuKienSinhVienAI** là nền tảng quản lý sự kiện sinh viên được xây dựng nhằm hỗ trợ việc quản lý các hoạt động, sự kiện và thông tin dành cho sinh viên.

Hệ thống được phát triển theo mô hình Frontend - Backend - Database, sử dụng ReactJS cho giao diện người dùng, FastAPI cho Backend và MySQL cho cơ sở dữ liệu.

Bên cạnh các chức năng nghiệp vụ, dự án được tích hợp Docker, Docker Compose, GitHub Actions và GitHub Container Registry (GHCR) nhằm xây dựng quy trình kiểm thử và đóng gói tự động.

---

## 2. Công nghệ sử dụng

### Frontend

- ReactJS
- Vite
- JavaScript
- Axios
- ESLint
- Nginx

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy
- Pytest
- Coverage
- Uvicorn

### Database

- MySQL 8.4
- MariaDB 10.4 được sử dụng trong môi trường CI

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)

### Công cụ phát triển

- Visual Studio Code
- Git
- GitHub
- Docker Desktop

---

## 3. Kiến trúc hệ thống

Hệ thống được tổ chức thành ba thành phần chính:

```text
                    USER
                      |
                      v
             ReactJS Frontend
                 Nginx :80
                      |
                      | HTTP / REST API
                      v
              FastAPI Backend
                 Uvicorn :8000
                      |
                      v
                MySQL Database
                   :3306
```

### 3.1. Kiến trúc Docker Compose

Trong môi trường Docker Compose, hệ thống gồm ba container:

```text
QuanLySuKienSinhVienAI
│
├── frontend
│   └── ReactJS + Nginx
│
├── backend
│   └── FastAPI + Uvicorn
│
└── db
    └── MySQL 8.4
```

---

## 4. Cấu trúc thư mục

```text
QuanLySuKienSinhVienAI/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── database/
│   └── QuanLySuKienSinhVienAI.sql
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 5. Chạy dự án bằng Docker Compose

### 5.1. Yêu cầu

Cần cài đặt:

- Docker Desktop
- Git
- Visual Studio Code

### 5.2. Khởi động hệ thống

Mở PowerShell tại thư mục dự án:

```powershell
docker compose up -d --build
```

### 5.3. Kiểm tra container

```powershell
docker compose ps
```

Kết quả mong đợi:

```text
frontend   Up
backend    Up
db         Up (healthy)
```

### 5.4. Các địa chỉ truy cập

Frontend:

```text
http://localhost
```

Backend:

```text
http://localhost:8000
```

Database:

```text
localhost:3306
```

---

## 6. Kiểm tra Backend API

Hệ thống cung cấp API Health để kiểm tra trạng thái Backend và kết nối Database.

API:

```text
http://localhost:8000/api/v1/health
```

Có thể kiểm tra bằng PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
```

Kết quả mong đợi:

```text
status  app                        database
------  ---                        --------
ok      QuanLySuKienSinhVienAI    connected
```

Kết quả trên xác nhận:

- FastAPI đang hoạt động.
- Backend đang chạy trên Docker.
- Backend kết nối được tới Database.

---

## 7. Docker Compose

File:

```text
docker-compose.yml
```

được sử dụng để quản lý toàn bộ hệ thống gồm:

```text
Frontend
Backend
MySQL
```

### Các lệnh thường dùng

Khởi động:

```powershell
docker compose up -d
```

Build và khởi động lại:

```powershell
docker compose up -d --build
```

Kiểm tra container:

```powershell
docker compose ps
```

Xem log toàn bộ hệ thống:

```powershell
docker compose logs
```

Xem log Backend:

```powershell
docker compose logs backend
```

Xem log Frontend:

```powershell
docker compose logs frontend
```

Xem log Database:

```powershell
docker compose logs db
```

Dừng hệ thống:

```powershell
docker compose down
```

---

## 8. CI/CD với GitHub Actions

Workflow CI/CD được lưu tại:

```text
.github/workflows/ci.yml
```

Workflow được kích hoạt khi:

- Push code lên branch `main`.
- Push code lên branch `develop`.
- Tạo Pull Request vào `main`.
- Tạo Pull Request vào `develop`.

Pipeline hiện tại gồm ba Job chính:

```text
Git Push
   |
   v
GitHub Actions
   |
   +---------------------------+
   |                           |
   v                           v
Frontend Job              Backend Job
   |                           |
   v                           v
ESLint                     MariaDB
npm Build                  Pytest
                           Coverage
   |                           |
   +-------------+-------------+
                 |
                 v
          Docker Build & Push
                 |
                 v
                GHCR
```

---

## 9. Frontend CI

Job:

```text
Frontend - Lint & Build
```

Các bước thực hiện:

```text
Checkout source code
        |
        v
Setup Node.js 24
        |
        v
npm ci
        |
        v
npm run lint
        |
        v
npm run build
```

Mục đích:

- Kiểm tra mã nguồn ReactJS.
- Phát hiện lỗi ESLint.
- Kiểm tra khả năng build ứng dụng.
- Đảm bảo Frontend có thể được đóng gói thành công.

---

## 10. Backend CI

Job:

```text
Backend - MariaDB & Pytest
```

Các bước thực hiện:

```text
Checkout source code
        |
        v
Setup Python 3.12
        |
        v
Install dependencies
        |
        v
Start MariaDB
        |
        v
Import database
        |
        v
Check database
        |
        v
Check FastAPI
        |
        v
Run Pytest
        |
        v
Generate Coverage
```

Backend sử dụng MariaDB 10.4 trong GitHub Actions để tạo môi trường kiểm thử độc lập.

Database được khởi tạo từ:

```text
database/QuanLySuKienSinhVienAI.sql
```

Pytest được chạy với Coverage:

```bash
python -m pytest -v \
  --cov=app \
  --cov-report=term-missing \
  --cov-report=xml
```

Coverage report được upload thành GitHub Actions artifact.

---

## 11. Docker Build và GitHub Container Registry

Sau khi Frontend và Backend CI hoàn thành thành công, Job Docker được thực hiện.

Quy trình:

```text
Frontend CI
     |
     | PASS
     v
Backend CI
     |
     | PASS
     v
Docker Build
     |
     +----------------------+
     |                      |
     v                      v
Backend Image         Frontend Image
     |                      |
     +----------+-----------+
                |
                v
       GitHub Container Registry
```

Docker Job được cấu hình để chỉ Push Docker Image khi workflow được kích hoạt bởi việc Push code.

Đối với Pull Request, Docker Image được Build để kiểm tra nhưng không Push lên GHCR.

---

## 12. GitHub Container Registry

Docker Image của dự án được lưu trữ trên GitHub Container Registry (GHCR).

### Backend Image

```text
ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-backend
```

### Frontend Image

```text
ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-frontend
```

Các Docker Image được tự động Build và Push thông qua GitHub Actions.

---

## 13. Pull Docker Image từ GHCR

### Backend

```powershell
docker pull ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-backend:latest
```

### Frontend

```powershell
docker pull ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-frontend:latest
```

Kiểm tra Docker Image:

```powershell
docker images
```

---

## 14. Kiểm tra Docker Image

Docker Image Backend:

```text
ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-backend
```

Docker Image Frontend:

```text
ghcr.io/nam1411512006-ai/quanlysukiensinhvienai-frontend
```

Các Image đã được kiểm tra bằng thao tác Docker Pull từ GHCR.

Việc Pull thành công chứng minh Docker Image đã được phát hành và có thể được tải về từ GitHub Container Registry.

---

## 15. Quy trình Git

Sau khi thay đổi mã nguồn:

```powershell
git status
```

Thêm thay đổi:

```powershell
git add .
```

Tạo commit:

```powershell
git commit -m "Update project"
```

Đẩy code lên GitHub:

```powershell
git push origin main
```

Sau khi Push, GitHub Actions sẽ tự động chạy Pipeline.

---

## 16. Quy trình CI/CD hoàn chỉnh

Quy trình hiện tại:

```text
Developer
    |
    | git push origin main
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    +-----------------------------+
    |                             |
    v                             v
Frontend CI                  Backend CI
    |                             |
    +-------------+---------------+
                  |
                  v
             Docker Build
                  |
                  v
        GitHub Container Registry
                  |
          +-------+-------+
          |               |
          v               v
      Frontend          Backend
       Image             Image
```

Quy trình này giúp tự động hóa các công việc:

- Kiểm tra mã nguồn Frontend.
- Build ReactJS.
- Kiểm tra Backend.
- Kiểm thử Backend bằng Pytest.
- Kiểm tra Database.
- Tạo Coverage Report.
- Build Docker Image.
- Push Docker Image lên GHCR.

---

## 17. Trạng thái hiện tại của dự án

Các thành phần DevOps đã hoàn thành:

- [x] ReactJS Frontend
- [x] FastAPI Backend
- [x] MySQL Database
- [x] Docker Backend
- [x] Docker Frontend
- [x] Docker Compose
- [x] GitHub Repository
- [x] GitHub Actions
- [x] Frontend ESLint
- [x] Frontend Build
- [x] Backend Pytest
- [x] Backend Coverage
- [x] MariaDB CI Environment
- [x] Docker Build
- [x] GitHub Container Registry
- [x] Backend Docker Image trên GHCR
- [x] Frontend Docker Image trên GHCR
- [x] Kiểm tra Docker Pull từ GHCR
- [x] Kiểm tra Backend Health API

---

## 18. Kiểm tra hệ thống sau khi triển khai Docker

Sau khi chạy:

```powershell
docker compose up -d --build
```

Kiểm tra:

```powershell
docker compose ps
```

Hệ thống cần có:

```text
Frontend    Up
Backend     Up
Database    Up (healthy)
```

Sau đó kiểm tra:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
```

Kết quả:

```text
status  app                        database
------  ---                        --------
ok      QuanLySuKienSinhVienAI    connected
```

---

## 19. Repository

GitHub Repository:

https://github.com/nam1411512006-ai/QuanLySuKienSinhVienAI

---

## 20. Ghi chú

Dự án hiện đang được phát triển và hoàn thiện thêm các chức năng nghiệp vụ.

Phần CI/CD hiện tại tập trung vào:

```text
Code Quality
     +
Automated Testing
     +
Docker
     +
Container Registry
```

Azure Cloud chưa được sử dụng trong phiên bản hiện tại do tài khoản Azure đang sử dụng không có Azure Subscription phù hợp.

---

## 21. Tác giả

**Dự án: QuanLySuKienSinhVienAI**

GitHub Repository:

https://github.com/nam1411512006-ai/QuanLySuKienSinhVienAI