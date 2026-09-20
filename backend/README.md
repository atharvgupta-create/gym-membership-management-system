# Gym Membership Management System — Backend

## Project Structure
```
backend/
├── config/
│   └── db.js          ← MongoDB connection setup
├── models/
│   ├── Admin.js       ← Admin schema
│   ├── Member.js      ← Member schema
│   └── Plan.js        ← Membership plan schema
├── routes/
│   ├── auth.js        ← Admin login/logout routes
│   ├── members.js     ← Member CRUD routes
│   └── plans.js       ← Membership plan routes
├── middleware/
│   └── authMiddleware.js ← JWT token verification
├── .env               ← Environment variables (never commit this)
├── .gitignore
└── server.js          ← Express app entry point
```
