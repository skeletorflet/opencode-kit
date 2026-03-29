---
name: rails-app
description: Ruby on Rails 7+ template principles. Hotwire, Stimulus, Turbo, Service Objects.
---
# Rails Application Template

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Ruby on Rails 7.1+ |
| Language | Ruby 3.2+ |
| Frontend | Hotwire (Turbo + Stimulus) |
| CSS | TailwindCSS (optional) or Bootstrap |
| JS | Stimulus controllers |
| Database | PostgreSQL (default), MySQL, SQLite |
| Background Jobs | Sidekiq (Redis) |
| Auth | Devise (or custom with JWT) |
| API Mode | Rails API (for JSON APIs) |
| Testing | RSpec, Factory Bot, Capybara |
| Build | Bundler |

---

## Directory Structure

```
project-name/
├── app/
│   ├── assets/
│   │   ├── images/
│   │   ├── stylesheets/
│   │   │   └── application.tailwind.css
│   │   └── javascripts/
│   │       ├── controllers/
│   │       │   ├── hello_controller.js
│   │       │   └── user_controller.js
│   │       └── application.js
│   ├── channels/
│   │   └── application_cable/
│   │       ├── connection.rb
│   │       └── channel.rb
│   ├── controllers/
│   │   ├── concerns/
│   │   │   └── authenticatable.rb
│   │   ├── application_controller.rb
│   │   ├── admin/
│   │   │   └── base_controller.rb
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── base_controller.rb
│   │   │       └── users_controller.rb
│   │   └── users_controller.rb
│   ├── helpers/
│   │   └── application_helper.rb
│   ├── javascript/
│   │   └── packs/
│   │       └── application.js (Webpacker) or entrypoints/
│   ├── mailers/
│   │   └── application_mailer.rb
│   ├── models/
│   │   ├── concerns/
│   │   │   └── timestampable.rb
│   │   ├── user.rb
│   │   └── post.rb
│   ├── views/
│   │   ├── layouts/
│   │   │   └── application.html.erb
│   │   ├── users/
│   │   │   ├── index.html.erb
│   │   │   ├── show.html.erb
│   │   │   ├── new.html.erb
│   │   │   └── edit.html.erb
│   │   └── posts/
│   │       └── _form.html.erb
│   ├── mailers/
│   │   └── user_mailer.rb
│   └── workers/
│       └── user_worker.rb
├── bin/
│   ├── bundle
│   ├── rails
│   └── rake
├── config/
│   ├── application.rb
│   ├── environment.rb
│   ├── environments/
│   │   ├── development.rb
│   │   ├── production.rb
│   │   └── test.rb
│   ├── initializers/
│   │   ├── devise.rb
│   │   └── session_store.rb
│   ├── locales/
│   │   ├── en.yml
│   │   └── models.yml
│   ├── routes.rb
│   ├── spring.rb
│   └── puma.rb
├── db/
│   ├── migrate/
│   │   └── 20240101000001_create_users.rb
│   ├── schema.rb
│   └── seeds.rb
├── lib/
│   ├── assets/
│   └── tasks/
├── log/
│   └── development.log
├── public/
│   ├── 404.html
│   ├── 422.html
│   ├── 500.html
│   ├── apple-touch-icon-precomposed.png
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   └── robots.txt
├── storage/
├── test/
│   ├── controllers/
│   │   └── users_controller_test.rb
│   ├── fixtures/
│   │   ├── users.yml
│   │   └── posts.yml
│   ├── helpers/
│   │   └── application_helper_test.rb
│   ├── integration/
│   │   └── users_test.rb
│   ├── mailers/
│   │   └── user_mailer_test.rb
│   ├── models/
│   │   └── user_test.rb
│   ├── system/
│   │   └── users_test.rb
│   └── fixtures/
│       └── files/
├── tmp/
│   ├── cache/
│   ├── pids/
│   ├── sockets/
│   └── storage/
├── vendor/
│   ├── assets/
│   │   ├── javascripts/
│   │   └── stylesheets/
│   └── bundle/
├── Dockerfile
├── docker-compose.yml
├── Gemfile
├── Gemfile.lock
├── README.md
├── Rakefile
└── config.ru
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Hotwire** | Turbo (HTML over the wire) + Stimulus (lightweight JavaScript) |
| **Service Objects** | Encapsulate business logic (not in controllers/models) |
| **Form Objects** | Handle complex validations and multi-model forms |
| **Policy Objects** | Authorization (with Pundit or custom) |
| **Presenters/Decorators** | Presentation logic (with Draper) |
| **Concerns** | Share code between models/controllers |
| **Active Record** | ORM with associations, validations, callbacks |
| **Migrations** | Database schema versioning |
| **Testing** | RSpec for unit/integration, Capybara for system tests |
| **Background Jobs** | Sidekiq for asynchronous processing |
| **Action Cable** | WebSockets for real-time features |
| **API Mode** | `rails new --api` for JSON-only backends |

---

## API Structure (Rails API Mode)

### Controllers (API)

```ruby
# app/controllers/api/v1/base_controller.rb
module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::HttpAuthentication::Token::ControllerMethods

      before_action :authenticate_user

      private

      def authenticate_user
        token = request.headers['Authorization']&.split(' ')&.last
        @current_user = User.find_by(auth_token: token)
        render_unauthorized unless @current_user
      end

      def render_unauthorized
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end
  end
end

# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < BaseController
      def index
        @users = User.all
        render json: @users, each_serializer: UserSerializer
      end

      def show
        @user = User.find(params[:id])
        render json: @user, serializer: UserSerializer
      end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: @user, serializer: UserSerializer, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password)
      end
    end
  end
end
```

### Serializers (Active Model Serializers)

```ruby
# app/serializers/user_serializer.rb
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :created_at

  # Optional: associations
  has_many :posts
end
```

### Routes (API)

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy]
      resources :posts, only: [:index, :show, :create, :update, :destroy]
    end
  end

  # Health check endpoint
  get '/health', to: 'health#index'
end
```

---

## Setup Steps

### 1. Install Dependencies

```bash
# Install Ruby (if not installed)
# Using rbenv or rvm is recommended
rbenv install 3.2.2
rbenv global 3.2.2

# Install Rails
gem install rails -v 7.1.3

# Create new Rails app
rails new project-name \
  --database=postgresql \
  --css=tailwind \
  --javascript=stimulus \
  --skip-test-unit  # We'll use RSpec

# Or for API-only:
# rails new project-name --api --database=postgresql
```

### 2. Configure Database

```yaml
# config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: postgres
  password: <%= ENV['POSTGRES_PASSWORD'] %>
  host: localhost

development:
  <<: *default
  database: project_name_development

test:
  <<: *default
  database: project_name_test

production:
  <<: *default
  database: project_name_production
  username: project_name
  password: <%= ENV['PROJECT_NAME_DATABASE_PASSWORD'] %>
```

### 3. Create Database

```bash
rails db:create
rails db:migrate
```

### 4. Add Gems (Optional but Recommended)

Add to Gemfile:
```ruby
gem 'devise'  # Authentication
gem 'pundit'  # Authorization
gem 'sidekiq' # Background jobs
gem 'redis-namespace' # For Sidekiq
gem 'factory_bot_rails'
gem 'rspec-rails'
gem 'faker'
gem 'dotenv-rails'  # For environment variables
```

Then:
```bash
bundle install
rails generate rspec:install
rails generate devise:install
rails generate devise User
rails generate pundit:install
```

### 5. Configure Sidekiq

```ruby
# config/initializers/sidekiq.rb
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] || 'redis://localhost:6379/0' }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] || 'redis://localhost:6379/0' }
end
```

### 6. Start Services

```bash
# Start Rails server
rails server

# Start Sidekiq (in separate terminal)
bundle exec sidekiq

# For development with hot reload (using foreman or overmind)
# Install overmind: brew install overmind
# Create Procfile:
# web: rails server
# worker: bundle exec sidekiq
# Then: overmind start
```

---

## Best Practices

- Use Service Objects for business logic (not in controllers or models)
- Use Form Objects for complex validations
- Use Concerns to share code between models/controllers
- Use Hotwire (Turbo + Stimulus) for interactivity instead of SPA frameworks
- Use Stimulus controllers for small JavaScript interactions
- Use Rails credentials for secrets (`rails credentials:edit`)
- Use environment variables for configuration (dotenv in development)
- Add indexes to database columns used in WHERE/JOIN/ORDER BY
- Use eager loading (`includes`, `preload`) to avoid N+1 queries
- Use background jobs for email sending, file processing, etc.
- Test with RSpec (unit, integration, system)
- Use Factory Bot for test fixtures
- Use database_cleaner for test isolation
- Add health check endpoint (`/health`)
- Implement graceful shutdown for Sidekiq
- Use Puma workers for production (configure in config/puma.rb)
- Add logging with Lograge or similar
- Use Active Storage for file uploads
- Implement caching (fragment, low-level, HTTP)
- Add security headers with `secure_headers` gem
- Use Rails generators for consistent code
- Follow Rails naming conventions (snake_case for files/variables, PascalCase for classes)
- Keep controllers skinny, move logic to services/models
- Use strong parameters (`params.require().permit()`)
- Avoid putting business logic in views
- Use partials for reusable view components
- Add comments for complex logic
- Keep migrations reversible
- Use `change` method in migrations when possible
- Add annotations to models (`gem annotate`) if desired
- Use enum for status fields with database constraints
- Consider using PostgreSQL extensions (uuid-ossp, pg_trgm) if needed
- Use bullet gem in development to detect N+1 queries
- Use rack-mini-profiler for performance profiling
- Add API versioning for public APIs
- Use Jbuilder or Active Model Serializers for JSON APIs
- Implement pagination (kaminari or pagy)
- Use background jobs for long-running requests
- Implement circuit breaker pattern for external services
- Add distributed tracing for microservices
- Use feature flags for gradual rollouts
- Implement proper error handling and logging
- Add monitoring and alerting for production
- Use Docker for consistent development/production environments
- Consider using Kubernetes for orchestration at scale