---
name: django-patterns
description: Django development principles and decision-making. Modern Django 4.2+ with DRF, Celery, Docker.
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0
---

# Django Patterns - Modern Django 4.2+

> Django development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Django development.

- START: Ask project scale (smallAPI vs enterprise)
- CHOOSE: Function-based vs Class-based views
- USE: Django REST Framework for APIs
- THINK: Django is "batteries included" - use built-in features

---

## 1. Project Structure by Scale

### Small Project

```
myproject/
├── manage.py
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── requirements.txt
└── .env
```

### Medium Project (Modular)

```
project/
├── manage.py
├── requirements.txt
├── .env
├── core/                    # Project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── apps.py
│   └── products/
├── services/                # Business logic
├── utils/                   # Shared utilities
├── templates/
├── static/
└── media/
```

### Large Project (DDD)

```
project/
├── core/
├── apps/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── views/
│   │   │   ├── __init__.py
│   │   │   ├── api/
│   │   │   └── admin/
│   │   ├── serializers/
│   │   ├── permissions/
│   │   └── tests/
│   └── orders/
├── domain/              # Domain layer
│   ├── entities/
│   ├── value_objects/
│   └── events/
├── application/         # Application services
│   ├── use_cases/
│   └── dtos/
├── infrastructure/      # DB, External APIs
│   ├── persistence/
│   ├── repositories/
│   └── external/
└── presentation/        # Views, APIs, Admin
```

---

## 2. Models & Database

### Model Patterns

```python
# models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model."""
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email


class TimestampedModel(models.Model):
    """Abstract base with created/updated timestamps."""
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


class Product(TimestampedModel):
    """Product model with proper relationships."""
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )
    tags = models.ManyToManyField('Tag', blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products'
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.name
```

### QuerySet Managers

```python
class ProductManager(models.Manager):
    """Custom manager with query methods."""
    
    def available(self):
        return self.filter(is_available=True)
    
    def in_stock(self):
        return self.filter(stock__gt=0)
    
    def by_category(self, category_slug):
        return self.filter(category__slug=category_slug)
    
    def with_price_range(self, min_price, max_price):
        return self.filter(price__gte=min_price, price__lte=max_price)


class Product(models.Model):
    # ... fields ...
    objects = ProductManager()
```

---

## 3. Django REST Framework

### Serializers

```python
# serializers.py
from rest_framework import serializers
from .models import User, Product
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users."""
    
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        validate_password(data['password'])
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product with nested relationships."""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'stock', 'is_available', 'category', 'category_name',
            'owner', 'owner_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        # Customize output
        data = super().to_representation(instance)
        data['price'] = float(instance.price)
        return data
```

### Views

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product with custom actions."""
    
    queryset = Product.objects.select_related('category', 'owner').all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    # Filtering
    filterset_fields = ['category', 'is_available']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        elif self.action in ['create']:
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Custom filtering
        in_stock = self.request.query_params.get('in_stock')
        if in_stock:
            queryset = queryset.filter(stock__gt=0)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def cheap(self, request):
        """Get cheap products under $10."""
        cheap_products = self.queryset.filter(price__lt=10)
        serializer = self.get_serializer(cheap_products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        """Publish a product."""
        product = self.get_object()
        product.is_available = True
        product.save()
        return Response({'status': 'product published'})
```

### URLs

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 4. Authentication

### JWT Authentication

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# settings.py - Simple JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### Custom Permissions

```python
# permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission: only owners can edit."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or request.user.is_staff


class IsAdminOrReadOnly(permissions.BasePermission):
    """Only admins can write, everyone can read."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

---

## 5. Background Jobs with Celery

```python
# tasks.py
from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_order_confirmation(order_id):
    """Send order confirmation email."""
    order = Order.objects.get(id=order_id)
    send_mail(
        'Order Confirmation',
        f'Your order #{order_id} has been confirmed.',
        'noreply@example.com',
        [order.user.email],
        fail_silently=False,
    )


@shared_task
def process_order(order_id):
    """Process order asynchronously."""
    from .services import OrderProcessor
    processor = OrderProcessor(order_id)
    processor.process()
    return f'Order {order_id} processed'


# Celery configuration
# celery.py
from celery import Celery

app = Celery('project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'delete-expired-orders': {
        'task': 'orders.tasks.delete_expired_orders',
        'schedule': 86400,  # Daily
    },
}
```

---

## 6. Testing

### Unit Tests

```python
# tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, Category

User = get_user_model()


class UserModelTest(TestCase):
    """Test User model."""
    
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123'
        )
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


class ProductModelTest(TestCase):
    def test_product_creation(self):
        category = Category.objects.create(name='Electronics')
        product = Product.objects.create(
            name='Laptop',
            slug='laptop',
            price=999.99,
            category=category
        )
        self.assertEqual(str(product), 'Laptop')
        self.assertEqual(product.category, category)
```

---

## 7. Django Settings Best Practices

```python
# settings.py - Key configurations
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'mydb'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'password'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

# Caching (use Redis in production)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Redis for Celery in production:
# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': os.getenv('REDIS_URL'),
#     }
# }

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
```

---

## 8. Deployment

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port
EXPOSE 8000

# Run
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  celery:
    build: .
    command: celery -A core worker -l info
    depends_on:
      - redis

volumes:
  postgres_data:
```

---

## 📋 Decision Checklist

Before implementing:

- [ ] **Project structure matches scale?**
- [ ] **Using Custom User model?**
- [ ] **DRF for API?**
- [ ] **Celery for background tasks?**
- [ ] **Proper settings structure?**
- [ ] **Testing configured?**
- [ ] **Docker for deployment?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use list() instead of queryset methods
- Skip database indexes
- Put business logic in views
- Use raw SQL when ORM suffices
- Skip migrations in production
- Store secrets in code

### ✅ DO:
- Use QuerySet managers
- Index foreign keys and fields in filters
- Use serializers for validation
- Use Celery for async tasks
- Use environment variables
- Use Django's built-in features

---

> **Remember:** Django has "batteries included".
> Use built-in features: Admin, Forms, Auth, Sessions, Messages.
> **Think in Django.**