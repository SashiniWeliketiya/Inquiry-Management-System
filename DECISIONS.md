# Engineering Decisions & Trade-offs

## 1. Assumptions Made
- **User Roles:** Kept it simple with two main user types: `Customer` (who creates and tracks inquiries) and `Staff/Admin` (who manages and updates inquiry statuses).
- **Authentication:** Used standard JSON Web Tokens (JWT) for handling user logins and keeping sessions simple on the client side.
- **Database Choice:** Chose PostgreSQL because relational databases make it very easy to manage foreign keys and tables between users and inquiries.

---

## 2. Meaningful Design Choices
- **Database-Level Status Enums:** Used PostgreSQL ENUM types (`'New'`, `'In Progress'`, `'Resolved'`) so that incorrect status names can never be saved into the database by mistake.
- **Clean Folder Structure:** Separated routes, controllers, and models properly in the backend so the code stays neat, easy to read, and organized.
- **Input Validation:** Checked all user inputs before sending them to the database to prevent bad data or basic security issues.

---

## 3. Key Trade-off Accepted
- **Stateless JWT vs. Token Blacklisting:** Decided to use simple JWT tokens without setting up a server-side logout blacklist database table to save development time. 
  - *Impact:* Once logged in, a token stays valid until it expires naturally, which is totally fine for an assessment project like this.

---

## 4. What I Would Improve Next
1. **Real-Time Alerts:** Add WebSockets so staff members get instant pop-up notifications when a new inquiry comes in without refreshing the page.
2. **Automated Testing:** Set up GitHub Actions to run tests automatically whenever code is pushed.
3. **Better Role Permissions:** Add more granular roles so junior staff and main administrators have different access levels.