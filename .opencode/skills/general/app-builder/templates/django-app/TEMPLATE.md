---
name: django-app
description: Django REST API template principles. DRF, Celery, PostgreSQL, Docker.
---

# Django Application Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Django 4.2+ |
| Language | Python 3.11+ |
| API | Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT (djangorestframework-simplejwt) |
| Task Queue | Celery + Redis |
| Validation | Django Forms + DRF Serializers |
| Testing | pytest |
| Docker | Multi-stage |

---

## Directory Structure

```
project-name/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── celery_app.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── management/
│   ├── products/
│   └── orders/
├── core/
│   ├── __init__.py
│   ├── decorators.py
│   ├── exceptions.py
│   ├── permissions.py
│   └── utils.py
├── templates/
│   ├── base.html
│   └── registration/
├── static/
├── media/
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── pytest.ini
├── pyproject.toml
├── manage.py
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Models

```python
# apps/users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom user model with email as username."""
    
    email = models.EmailField(_('email address'), unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email


class TimestampedModel(models.Model):
    """Abstract base with timestamps."""
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
```

---

## Serializers

```python
# apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'bio']


class UserCreateSerializer(serializers.ModelSerializer):
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
```

---

## Views

```python
# apps/users/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserViewSet(viewsets.ModelViewSet):
    """UserViewSet for CRUD operations."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'login', 'refresh']:
            return [AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        return TokenObtainPairView.as_view()(request)
    
    @action(detail=False, methods=['post'], url_path='refresh')
    def refresh(self, request):
        return TokenRefreshView.as_view()(request)
```

---

## Celery Tasks

```python
# config/celery_app.py
from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

app = Celery('project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


# apps/users/tasks.py
from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_welcome_email(user_id):
    from apps.users.models import User
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            'Welcome to our platform',
            f'Hello {user.username}, welcome!',
            'noreply@example.com',
            [user.email],
            fail_silently=False,
        )
        return f'Email sent to {user.email}'
    except User.DoesNotExist:
        return 'User not found'


@shared_task
def cleanup_old_sessions():
    """Cleanup expired sessions."""
    from django.contrib.sessions.models import Session
    Session.objects.filter(expire_date__lt=timezone.now()).delete()
    return 'Old sessions cleaned up'
```

---

## Docker Compose

```yaml
version: '3.9'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379/0
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: gunicorn config.asgi:application -b 0.0.0.0:8000

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery:
    build: .
    command: celery -A config.celery_app worker -l info
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery-beat:
    build: .
    command: celery -A config.celery_app beat -l info
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

---

## GitHub Actions CI/CD

```yaml
name: Django CI/CD

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
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install SQLite for tests
        run: |
          sudo apt-get update
          sudo apt-get install -y libpq-dev
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements/base.txt
      - name: Run tests
        run: |
          python manage.py test --verbosity=2

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install flake8 black isort
      - name: Lint
        run: |
          flake8 .
          black --check .
          isort --check .

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker
        run: docker build -t myapp:${{ github.sha }} .
```

---

## Environment Variables

```bash
# .env
DEBUG=False
SECRET_KEY=django-insecure-change-this-in-production-32-chars

# Database
POSTGRES_DB=mydb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# AWS (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
```

---

## Best Practices

- Use environment variables for all secrets
- Run migrations before deployment
- Use Celery for background tasks
- Cache with Redis in production
- Use WhiteNoise for static files
- Configure CORS properly
- Use custom user model from start
- Write tests with pytest
- Use fixtures for test data
- Configure logging for production