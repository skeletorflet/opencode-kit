---
name: nestjs-api
description: NestJS REST API template principles. TypeORM, JWT Auth, Swagger, Docker.
---

# NestJS API Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | NestJS 10+ |
| Language | TypeScript |
| Database | PostgreSQL + TypeORM |
| Validation | class-validator |
| Auth | Passport + JWT |
| Documentation | Swagger/OpenAPI |
| Testing | Jest |
| Docker | Multi-stage build |

---

## Directory Structure

```
project-name/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── configuration.ts
│   │   └── env.validation.ts
│   ├── modules/
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── auth/
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── common/
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts
│   │       ├── interceptors/
│   │       │   └── logging.interceptor.ts
│   │       └── pipes/
│   │           └── validation.pipe.ts
│   ├── shared/
│   │   ├── utils/
│   │   └── constants/
│   └── database/
│       ├── database.module.ts
│       └── migrations/
├── test/
│   ├── unit/
│   └── e2e/
├── docker-compose.yml
├── Dockerfile
├── docker-entrypoint.sh
├── .env.example
├── package.json
├── tsconfig.json
├── nest-cli.json
├── jest.config.js
└── README.md
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Generate secret key
openssl rand -base64 32

# Start database (PostgreSQL)
docker-compose up -d

# Run in development
npm run start:dev

# Build for production
npm run build
```

---

## Entities

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## Auth Configuration

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

---

## Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_HOST=postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## CI/CD GitHub Actions

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run test:cov

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: docker/build-push-action@v5
        with:
          push: false
```

---

## Environment Variables

```bash
# .env
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=mydb

# JWT
JWT_SECRET=your-secret-key-here-min-32-characters
JWT_EXPIRATION=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Best Practices

- Use DTOs with class-validator
- Implement proper error filters
- Use interceptors for logging
- Configure CORS properly
- Use environment variables
- Implement JWT refresh tokens
- Add rate limiting
- Use transactions for multi-table operations
- Index frequently queried columns
- Use pagination for list endpoints