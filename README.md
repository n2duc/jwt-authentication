<h1 align="center">
  N2Dev - JWT Authentication
</h1>

<p align="center">
  <a aria-label="Framework" href="https://nextjs.org">
    <img alt="" src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=Next.js&labelColor=000">
  </a>
  <img alt="" src="https://img.shields.io/github/languages/top/n2duc/jwt-authentication?style=for-the-badge&labelColor=000">
</p>

This repository contains the code for my authentication repo, where I share my thoughts, projects, and insights. Feel free to explore and get inspired.

## ✨ Features

- ⚡️ Express.js for Server
- ⚛️ React.js with Typescript for Client
- 🎨 Tailwind CSS - for styling
- 🌈 Shadcn UI - accessible UI components
- 🛡 Strict TypeScript and ESLint configuration
- 🔒 Jsonwebtoken - Authentication
- 🍀 MongoDB - Store database

## 🔨 Requirements
- [Node.js](https://nodejs.org) `>=20.0.0`
- [Yarn](https://yarnpkg.com/) - package manager
- [Visual Studio Code](https://code.visualstudio.com/)

## 👋 Getting Started

Follow these steps to run the project locally on your machine:

1. Clone the repository

```bash
git clone https://github.com/n2duc/jwt-authentication.git
```

2. Navigate to the project directory

```bash
cd jwt-authentication
```

Stay in folder, redirect to Front-end:
```bash
cd web-client-vite
```

And Back-end:
```bash
cd api-server
```

3. Change environment variables in .env file

In FE:
```bash
VITE_API_URL = 'your-api-endpoint'
```

In BE:
```bash
MONGO_DB_URI = 'mongo-db-uri-here'
PORT = 'port server here'
ACCESS_TOKEN_SECRET_SIGNATURE = 'JWT secret signature here'
REFRESH_TOKEN_SECRET_SIGNATURE = 'JWT secret signature here'
```

4. Install dependencies (common to both FE & BE)

```bash
yarn install
```

5. Run the development server (common to both FE & BE)

```bash
yarn dev
```

<hr>
<p align="center">
From N2Dev with Love ❤️❤️‍🔥
</p>