# DoctorWeb

Website phòng khám gồm một ứng dụng Next.js và REST API Spring Boot.

## Cấu trúc

```text
DoctorFrontend/  Next.js 16, React 19, TypeScript và Tailwind CSS
DoctorBackend/   Spring Boot 3, Java 17, JPA, Flyway và MySQL
```

Frontend được tổ chức theo feature trong `src/features`; hạ tầng dùng chung nằm
trong `src/shared`. Backend hiện là modular monolith nhỏ, với cấu hình dùng chung
trong package `global`.

## Chạy local

1. Sao chép các file môi trường mẫu:

   ```powershell
   Copy-Item DoctorBackend/.env.properties.example DoctorBackend/.env.properties
   Copy-Item DoctorFrontend/.env.example DoctorFrontend/.env.local
   ```

2. Khởi động MySQL:

   ```powershell
   docker compose up -d mysql
   ```

3. Chạy backend:

   ```powershell
   Set-Location DoctorBackend
   .\gradlew.bat bootRun
   ```

4. Trong terminal khác, chạy frontend:

   ```powershell
   Set-Location DoctorFrontend
   npm install
   npm run dev
   ```

Frontend chạy tại `http://localhost:3000`, backend tại `http://localhost:8080`.
Flyway tự áp dụng migration khi backend khởi động.

## Kiểm tra

```powershell
Set-Location DoctorFrontend
npm run lint
npm run build:next

Set-Location ..\DoctorBackend
.\gradlew.bat test
```

Không commit `.env.local` hoặc `.env.properties`.
