---
name: nestjs-expert
description: NestJS development principles and decision-making. Modern Node.js enterprise framework with TypeScript, dependency injection, modules.
---

# NestJS Expert - Modern Node.js Enterprise Framework

> NestJS development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for NestJS development.

- ASK user for use case (API, Microservice, WebSocket, GraphQL)
- Choose proper module structure for the project size
- Use TypeScript properly with interfaces and DTOs

---

## 1. NestJS Core Concepts

### Architecture Overview

```
NestJS follows Angular-like architecture:
├── Modules (logical grouping)
├── Controllers (route handlers)
├── Services (business logic)
├── Providers (DI beans)
├── Pipes (validation)
├── Guards (auth)
├── Interceptors (middleware)
└── Filters (error handling)
```

### Directory Structure by Scale

```
Small (的单模块):
src/
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts

Medium (分模块):
src/
├── modules/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   └── entities/
│   └── auth/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
└── config/

Large (DDD):
src/
├── domain/
│   ├── users/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── services/
│   └── orders/
├── application/
│   ├── use-cases/
│   └── dtos/
├── infrastructure/
│   ├── database/
│   └── external/
└── presentation/
    ├── controllers/
    └── modules/
```

---

## 2. Module System

### Feature Modules

```typescript
// users/users.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),  // Entities managed by this module
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => AuthModule),  // If there's circular dependency
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [UsersService],  // Make available to other modules
})
export class UsersModule {}
```

### Shared Modules

```typescript
// common/common.module.ts
@Global()
@Module({
  providers: [
    {
      provide: 'LOGGER',
      useClass: Logger,
    },
  ],
  exports: ['LOGGER'],
})
export class CommonModule {}

// Now use in any module by importing CommonModule
```

---

## 3. Dependency Injection Patterns

### Constructor Injection

```typescript
// Standard injection
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    @Inject('CONFIG') private config: ConfigService,
  ) {}
}
```

### Multiple Implementations

```typescript
// Use interface
export interface PaymentGateway {
  process(amount: number): Promise<PaymentResult>;
}

// Stripe implementation
@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  async process(amount: number): Promise<PaymentResult> {
    // Stripe logic
  }
}

// PayPal implementation
@Injectable()
export class PayPalPaymentGateway implements PaymentGateway {
  async process(amount: number): Promise<PaymentResult> {
    // PayPal logic
  }
}

// Use with @Inject
@Injectable()
export class OrderService {
  constructor(
    @Inject('PaymentGateway') private paymentGateway: PaymentGateway,
  ) {}
}

// Register in module
{
  provide: 'PaymentGateway',
  useClass: config.paymentProvider === 'stripe' 
    ? StripePaymentGateway 
    : PayPalPaymentGateway,
}
```

### Custom Providers

```typescript
// Value provider
{
  provide: 'APP_NAME',
  useValue: 'MyApp',
}

// Class provider (singleton)
{
  provide: UsersService,
  useClass: UsersServiceImpl,
}

// Factory provider (complex instantiation)
{
  provide: 'ANALYTICS',
  useFactory: (config: ConfigService) => {
    return new Analytics(config.analyticsKey);
  },
  inject: [ConfigService],
}
```

---

## 4. Controllers and Routing

### REST Controller

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() query: PaginationQuery) {
    return this.usersService.findAll(query.page, query.limit);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

### GraphQL Controller

```typescript
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  @UseGuards(GqlJwtAuthGuard)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @ResolveField()
  async posts(@Parent() user: User): Promise<Post[]> {
    return this.usersService.getUserPosts(user.id);
  }
}
```

### WebSocket Gateway

```typescript
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    const message = { ...payload, timestamp: new Date() };
    this.server.emit('message', message);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
}
```

---

## 5. Validation and Pipes

### Built-in ValidationPipe

```typescript
// DTOs with class-validator
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(['user', 'admin', 'moderator'])
  role: UserRole;
}

// Global validation in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip properties not in DTO
      forbidNonWhitelisted: true,   // Throw error if extra properties
      transform: true,              // Transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  await app.listen(3000);
}
```

### Custom Pipe

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(`Invalid number: ${value}`);
    }
    return parsedValue;
  }
}

// Usage in controller
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

---

## 6. Authentication

### JWT Auth with Guards

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}

// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// Usage in controller
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### Role-based Access Control

```typescript
// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Usage
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
async remove(@Param('id') id: string) {
  // Only admins can delete
}
```

---

## 7. Database Integration

### TypeORM Integration

```typescript
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      entities: [User, Post],
      synchronize: false,  // Don't use in production!
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class AppModule {}

// Entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Transform(({ value }) => bcrypt.hash(value), { to: 'save' })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Repository pattern
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}
```

### Prisma Integration

```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}

// Usage
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: { posts: true },
    });
  }
}
```

---

## 8. Error Handling

### Custom Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const res = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof res === 'object' ? (res as any).message : res,
    });
  }
}

// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger('ExceptionFilter');
    logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
}
```

---

## 9. Testing

### Unit Tests

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [new User(), new User()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toBe(users);
    });
  });
});
```

### E2E Tests

```typescript
describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get JWT token for authenticated requests
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    
    jwtToken = response.body.access_token;
  });

  it('/users (GET) - should return users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

## 10. Decision Checklist

Before implementing:

- [ ] **Module structure matches project scale?**
- [ ] **Validation using class-validator?**
- [ ] **Authentication with guards?**
- [ ] **Error handling with filters?**
- [ ] **Database: TypeORM or Prisma?**
- [ ] **Testing strategy?**
- [ ] **Environment configuration?**
- [ ] **CORS configured?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Put all code in single module
- Use any instead of proper types
- Skip validation pipes
- Use synchronize: true in production
- Not implement error handling
- Forget to set up CORS

### ✅ DO:
- Use DTOs with class-validator
- Use Pipes for transformation
- Implement proper guards
- Use interceptors for logging
- Use filters for error handling
- Use serialization with class-transformer

---

## 📋 Tools by Use Case

| Use Case | Tool | Package |
|----------|------|---------|
| Database ORM | TypeORM | @nestjs/typeorm |
| Database ORM | Prisma | nestjs-prisma |
| Validation | class-validator | @nestjs/class-validator |
| GraphQL | Apollo | @nestjs/graphql + graphql |
| WebSockets | Socket.io | @nestjs/websockets |
| Queue | BullMQ | @nestjs/bull |
| Config | Config | @nestjs/config |
| Docs | Swagger | @nestjs/swagger |
| Auth | Passport | @nestjs/passport |
| Events | Event Emitter | @nestjs/event-emitter |
| Cron | Schedule | @nestjs/schedule |
| Testing | Jest | @nestjs/testing |

---

> **Remember:** NestJS is about structure and enterprise patterns.
> Use modules, services, and controllers properly.
> **Think in architecture.**