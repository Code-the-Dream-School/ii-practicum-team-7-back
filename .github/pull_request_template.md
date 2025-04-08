## **User Authentication**

### **Description**
- This pull request sets up the backend for user login and registration. Passwords are securely hashed before being saved to the MongoDB database. Upon successful login or registration, a token is generated and attached to the individual user. This token is required for authentication, as only authenticated users are allowed to perform further actions, such as posting jobs.
- It is related to scrum 18.

### **Changes Made**
- List of key changes in this PR:
  - [X] Added/Modified endpoints
  - [ ] Fixed bugs
  - [X] Updated database models
  - [X] Middleware/Service updates

### **How to Test**
- Steps to test this PR:
  1. Checkout the branch locally: `git checkout hannah-user-authentication-scrum18
  2. Run `npm install` to install dependencies.
  3. Run tests with `npm test`.
  4. Start the server: `npm run dev` (or your project's start command).
  5. Use Postman, cURL, or your frontend to hit the updated/added endpoints and confirm functionality.

### **Screenshots (if applicable)**
Attach any screenshots or logs relevant to the PR here.

### **Checklist**
- [ ] Tests pass (`npm test` or other test command).
- [ ] Code is linted and formatted (`eslint`, `prettier`, etc.).
- [ ] API documentation updated (if applicable).
- [ ] Backend integration with the frontend is verified (if applicable).

### **Related Issues**
- Resolves #[issue-number]
- Mention any other relevant tickets/issues.
