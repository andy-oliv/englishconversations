# English Conversations — Backend API

**English Conversations** is a backend API built with **NestJS** and **TypeScript**, powering a complete English learning platform. It supports interactive exercises, quizzes, tests, progress tracking, email notifications, and more — all backed by a role-based access system and RESTful architecture.

## Tech Stack

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=flat&logo=swagger&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=flat&logo=jest&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=flat&logo=amazons3&logoColor=white)

## 📁 Project Structure

```bash
src/
├── answered-exercise/   # exercise answers
├── answered-quiz/       # quiz answers
├── assets/              # logo for swagger customization
├── auth/                # Authentication & Authorization (JWT, RBAC)
├── chapter/             # Collection of units
├── common/              # Decorators & common types
├── config/              # Multer configuration
├── email/               # Email service
├── entities/            # SQL entities
├── exercises/           # Interactive exercises
├── file/                # Image and PDF files
├── helper/              # global functions, log and return messages, test mocks
├── notifications/       # In-app notification system
├── prisma/              # Prisma module
├── quiz/                # Quizzes and tests
├── s3/                  # AWS S3 module
├── tag/                 # Content tags
├── unit/                # Collection of content (video, exercises, quizzes)
├── user/                # User CRUD operations
├── user-chapter/        # Chapter progress
├── user-notification/   # User notification relation
├── user-unit/           # Unit progress
├── video/               # Video module
├── video-progress/      # Video progress

```

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run start:dev
```

## API Documentation (Swagger)

http://localhost:3000/api/docs

## Environment Variables

Configure your .env file with the following:

````bash
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DB_NAME?schema=public"
TEST_DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DB_NAME?schema=public"
BETTERSTACK_TOKEN="your token from Better Stack"
BETTERSTACK_CONNECTION="your connection ID from Better Stack"
SALT_ROUNDS="10"
JWT_SECRET="your-secret-key"
COOKIE_SECRET="your-cookie-secret"
ACCESS_TOKEN_EXPIRATION="3600s"
REFRESH_TOKEN_EXPIRATION="7d"
CONFIRMATION_TOKEN_EXPIRATION="1h"
JWT_ISSUER="EnglishConversationsAPI"
RESEND_API_KEY="your Resend.com API key"
FRONTEND_URL="http://localhost:4000"
LOGO_URL="S3 public URL"
USER_PLACEHOLDER="S3 default avatar URL"
AWS_REGION="your AWS region"
AWS_ACCESS_KEY="your AWS access key"
AWS_SECRET_ACCESS_KEY="your AWS secret"
AWS_BUCKET_NAME="your S3 bucket name"
PRESIGNED_URL_EXPIRATION="60000"
```
````
