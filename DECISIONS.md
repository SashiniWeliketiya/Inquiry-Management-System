

```markdown
# Engineering Decisions & Trade-offs

## 1. Assumptions Made
- **User Roles:** Two primary user types: `Customer` (submits and tracks inquiries) and `Staff/Admin` (reviews, updates inquiry status, and manages records).
- **Session Management:** Stateless JSON Web Tokens (JWT) are used for authentication, storing token state on the client side.
- **Relational Integrity:** PostgreSQL was selected to utilize native database constraints (`SERIAL`, Foreign Keys, and custom `ENUM` types for inquiry statuses).

---

## 2. Meaningful Design Choices
- **Database-Level Enums for Statuses:** Implemented PostgreSQL ENUM types (`'New'`, `'In Progress'`, `'Resolved'`) to strictly enforce valid inquiry states at the database level and prevent data corruption.
- **Layered Backend Architecture:** Separated controllers, middleware (auth/validation), and database models to maintain clean separation of concerns and code reusability.
- **Input Validation & Sanitization:** Validated incoming requests before database queries to protect against invalid data entries and injection vulnerabilities.

---

## 3. Key Trade-off Accepted
- **Stateless JWT vs. Token Blacklisting:** Chose standard stateless JWT authentication without server-side revocation tables to reduce implementation complexity. 
  - *Impact:* Active tokens cannot be forcefully revoked before expiration upon logout, which is acceptable for the scope of this evaluation.

---

## 4. What I Would Improve Next
1. **Real-Time Notifications:** Integrate WebSockets (Socket.io) to instantly alert staff members when a new inquiry is submitted.
2. **Automated CI/CD Pipeline:** Configure GitHub Actions for automated unit test execution on pull requests.
3. **Advanced Role-Based Access Control (RBAC):** Introduce granular permissions separating junior staff and senior administrators.