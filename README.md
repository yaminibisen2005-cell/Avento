# AVENTO — Enterprise Campus Event & Turnstile Management Platform

<p align="center">
  <strong>High-performance campus event management, 0.3s QR turnstile check-ins, Razorpay payments, and cryptographic smart certificates.</strong>
</p>

---

## 🏛️ System Architecture

The platform is architected following enterprise-grade Clean Architecture and Domain-Driven Design (DDD) principles:

- **Frontend**: React 19, Tailwind CSS, Framer Motion, Axios with JWT & Refresh Token interceptors.
- **Backend**: Spring Boot 3.3.4, Java 21, Spring Security 6 (Stateless JWT + In-Memory Token-Bucket Rate Limiter), Spring Data JPA, Spring Boot Mail.
- **Database**: MySQL 8.0 with relational constraints and cascade policies.
- **Document Engine**: OpenPDF for branded tax invoices & Apache POI for Excel attendance and revenue settlement rosters.
- **Media & Storage**: Cloudinary integration with local disk fallback (`uploads/`).
- **Payments**: Razorpay Standard Checkout with server-side HMAC SHA-256 cryptographic verification.
- **API Documentation**: OpenAPI 3.0 (Swagger UI) with Bearer token authentication.

---

## 🚀 15 Enterprise Features Implemented

1. **Real Email System (`EmailService`)**:
   - Spring Boot Mail & SMTP integration with HTML templates:
     - Forgot Password OTP
     - Welcome Email
     - Registration Confirmation
     - Ticket Pass with QR Verification
     - Smart Certificate Issue
     - Organizer Account Approval
     - Payment Receipt & Tax Invoice
     - Refund Confirmation
     - System Announcements

2. **Real Push & Notification Center**:
   - `GET /api/notifications`: List notifications with time formatting
   - `GET /api/notifications/unread-count`: Real-time unread badge count
   - `PUT /api/notifications/{id}/read`: Mark individual notification as read
   - `PUT /api/notifications/read-all`: Bulk mark all as read
   - `DELETE /api/notifications/{id}`: Delete notification

3. **Global Multi-Entity Search Engine**:
   - `GET /api/search?q={query}&type={type}`
   - Fast sub-string and full-text index across:
     - `EVENTS` (title, description, tags, venue)
     - `ORGANIZERS` (college, council name)
     - `CERTIFICATES` (credential IDs, student names)
     - `PAYMENTS` (transaction IDs, razorpay order IDs)
     - `ANNOUNCEMENTS` (broadcast notices)

4. **Advanced Multi-Dimensional Filtering & Sorting**:
   - Explore Events filter bar:
     - Category pills (Hackathons, Workshops, Seminars, Competitions, etc.)
     - Event mode (In-Person, Online)
     - Fee filter (All, Free, Paid)
     - Dynamic sorting (Newest, Popularity, Fee: Low to High, Fee: High to Low)

5. **Wishlist & Bookmarking Engine**:
   - `GET /api/wishlist`: Retrieve saved events
   - `POST /api/wishlist/{eventId}`: Save event
   - `DELETE /api/wishlist/{eventId}`: Remove event
   - `GET /api/wishlist/check/{eventId}`: Instant boolean check for UI heart button

6. **Verified Reviews & Rating System**:
   - `GET /api/events/{id}/reviews`: Public average rating, total count, review stream
   - `POST /api/events/{id}/reviews`: Submit rating (1-5 stars) and comment with verified attendee check
   - `POST /api/reviews/{id}/reply`: Official host council responses
   - `POST /api/reviews/{id}/report`: Flag inappropriate reviews for admin moderation

7. **Live Interactive Chat & Helpdesk**:
   - `GET /api/chat/conversations`: Active threads
   - `GET /api/chat/messages/{partnerId}`: Message history
   - `POST /api/chat/send`: Instant message dispatch
   - `PUT /api/chat/read/{partnerId}`: Read receipts

8. **Enterprise Asset & File Upload**:
   - `POST /api/upload`: Multipart file upload with Cloudinary integration and local disk storage fallback.

9. **Automated Export & Reporting**:
   - PDF Tax Invoices with OpenPDF
   - Excel Attendance Rosters with Apache POI
   - Excel Revenue Settlement Ledgers
   - CSV Events Catalog Export

10. **Interactive Analytics & Dashboard**:
    - Real-time monthly revenue, attendee counts, ticket scans, growth metrics, and category distributions.

11. **Comprehensive Audit Logging**:
    - `GET /api/admin/audit-logs`
    - Tracks user logins, password resets, organizer approvals, payments, refunds, and ticket validations.

12. **Global Error Handling & Resilient UI**:
    - Centralized `GlobalExceptionHandler` with standardized JSON errors (`timestamp`, `status`, `error`, `message`, `path`).
    - Toast notifications for success, warning, and error states.

13. **Performance Optimization**:
    - Code splitting with Vite, lazy component loading, database indexing, and pre-warmed token buckets.

14. **Security & Armor**:
    - Refresh token rotation (7-day lifecycle, user uniqueness upsert).
    - Sliding token-bucket rate limiting filter (150 req/min per IP on public auth).
    - BCrypt password hashing.
    - Strict HTTP security response headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

15. **Deployment & DevOps Ready**:
    - Multi-stage `Dockerfile` for backend (Eclipse Temurin Java 21 JRE).
    - Multi-stage `Dockerfile` for frontend (Node 20 + Nginx Alpine).
    - `docker-compose.yml` orchestrating MySQL, Backend, and Frontend.
    - GitHub Actions CI/CD workflow (`.github/workflows/ci-cd.yml`).
    - OpenAPI Swagger UI at `http://localhost:8081/swagger-ui/index.html`.

---

## 🏃 Running with Docker Compose & Environment Variables

### 1. Configure Environment Variables
Copy the template to create your `.env` configuration:
```bash
cp .env.example .env
```
Adjust your database passwords, Razorpay credentials, and Google OAuth Client ID if needed.

### 2. Start the Full Stack with Docker
```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost` (or `${FRONTEND_PORT}`)
- **Backend API**: `http://localhost:8081` (or `${BACKEND_PORT}`)
- **Swagger Documentation**: `http://localhost:8081/swagger-ui.html`
- **MySQL Database**: `localhost:3306` (or `${MYSQL_PORT}`)

### 3. Stop Containers
```bash
docker compose down
```
