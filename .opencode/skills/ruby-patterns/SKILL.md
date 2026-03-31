---
name: ruby-patterns
description: Ruby development principles and decision-making. 
             Modern Ruby 3.3+, Rails 7.2, Ruby pattern matching, Ractor.
---

# Ruby Patterns - Modern Ruby 3.3+

> Ruby development principles and decision-making.
> **Learn to THINK, not copy-paste patterns.**

---

## ⚠️ How to Use This Skill

This skill teaches **decision-making principles** for Ruby development.

- ASK user for framework (Rails, Hanami, Sinatra)
- Use modern Ruby 3.x features
- Don't write Rails 2/3/4 era code

---

## 1. Framework Selection

### Decision Tree

```
What are you building?
│
├── Full-stack Web Application
│   ├── Rails 7+ (defacto, maintainable)
│   │   ├── Hotwire (Turbo + Stimulus)
│   │   └── ViewComponent (component-based)
│   └── Hanami (newer, clean architecture)
│
├── Minimal Web App
│   ├── Sinatra (lightweight, Rack-based)
│   └── Roda (minimal, routing tree)
│
├── API-only Backend
│   ├── Rails API mode (with Hotwire optional)
│   └── Hanami (pure REST)
│
├── CLI Tools
│   ├── Thor (rich CLI framework)
│   └── Commander (simpler)
│
└── Background Jobs
    ├── Sidekiq (most popular, Redis)
    │   ├── Good job throughput
    │   └── Large community + ecosystem
    │   └── Sidekiq Pro (paid, more features)
    ├── Resque (Redis-backed)
    └── Sneakers (RabbitMQ)
```

### Comparison Table

| Factor | Rails | Hanami | Sinatra |
|--------|-------|--------|---------|
| **Ecosystem** | Largest | Growing | Small |
| **Learning Curve** | Medium | Medium-High | Very Low |
| **Architecture** | MVC | Clean layers | Route-based |
| **Performance** | Good | Very Good | Best |
| **Best For** | Full-stack apps | DDD, APIs | Microservices |

---

## 2. Modern Ruby 3.x Features

### Pattern Matching

```ruby
# NEW in Ruby 3+: Pattern matching
case user
in { name: String => name, age: 18... }
  puts "Adult: #{name}"
in { role: 'admin' | 'superadmin', age: Integer }
  puts "Admin user"
in name:, **rest
  puts "Custom: #{name}, others: #{rest.keys}"
else
  puts "Unknown user"
end
```

### Ractor (Parallel Execution)

```ruby
# Ractor: True parallelism in Ruby 3
ractor = Ractor.new do
  # Runs in parallel
  result = expensive_computation
  Ractor.yield(result)
end

# Get result
result = ractor.take
```

### Rightward Assignment

```ruby
# Ruby 3.1+: Rightward assignment
# Before
user = find_user(id)

# After
find_user(id) => user
```

### Endless Methods

```ruby
# Single-line methods
def greet(name) = "Hello, #{name}!"
def active? = @status == 'active'
```

---

## 3. Rails 7 Patterns

### Service Objects

```ruby
# app/services/create_user.rb
class CreateUser
  def initialize(user_params:, mailer: UserMailer)
    @params = user_params
    @mailer = mailer
  end

  def call
    user = User.new(@params)
    
    return Failure(user.errors) unless user.save
    
    @mailer.welcome(user).deliver_now
    
    Success(user)
  end
end

# Usage with monad
result = CreateUser.call(user_params: { name: 'John', email: 'john@test.com' })
result.failure?  # false
result.value.name # 'John'
```

### Form Objects

```ruby
# app/forms/user_form.rb
class UserForm
  include ActiveModel::Model
  
  attr_accessor :name, :email, :password
  
  validates :name, presence: true
  validates :email, format: { with: /@/ }
  validates :password, length: { minimum: 8 }
  
  def save
    return false unless valid?
    
    User.create!(name: name, email: email, password: password)
  end
end

# In controller
def create
  @form = UserForm.new(params.require(:user).permit!)
  
  if @form.save
    redirect_to @form.user, notice: 'Created!'
  else
    render :new, status: :unprocessable_entity
  end
end
```

### Command Pattern

```ruby
# app/commands/base_command.rb
class BaseCommand
  include Dry::Monads[:result]
  
  def call
    raise 'Implement in subclass'
  end
  
  protected
  
  def failure!(errors)
    Failure(errors)
  end
  
  def success!(result)
    Success(result)
  end
end

class UpdateUser < BaseCommand
  def initialize(user_id:, attributes:)
    @user_id = user_id
    @attributes = attributes
  end
  
  def call
    user = User.find_by(id: @user_id)
    return failure!('Not found') unless user
    
    user.update!(@attributes)
    success!(user)
  end
end
```

---

## 4. Hotwire Patterns (Rails 7)

### Stimulus Controllers

```javascript
// app/javascript/controllers/hello_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "name", "output" ]
  
  greet() {
    this.outputTarget.textContent = `Hello, ${this.nameTarget.value}!`
  }
}
```

### Turbo Streams

```ruby
# Controller returning Turbo stream
def create
  @user = User.create!(params.require(:user))
  
  respond_to do |format|
    format.turbo_stream do
      render turbo_stream: turbo_stream.append(
        'users', 
        partial: 'user', 
        locals: { user: @user }
      )
    end
    format.html { redirect_to @user }
  end
end
```

---

## 5. Testing Patterns

### RSpec Framework

```ruby
# Model spec
RSpec.describe User, type: :model do
  describe 'validations' do
    it 'validates presence of email' do
      user = User.new(email: nil)
      expect(user).not_to be_valid
    end
  end
  
  describe '#full_name' do
    context 'with first and last name' do
      it 'combines both names' do
        user = User.new(first_name: 'John', last_name: 'Doe')
        expect(user.full_name).to eq('John Doe')
      end
    end
  end
end

# Request spec
RSpec.describe 'Users API', type: :request do
  describe 'GET /api/users' do
    it 'returns users' do
      create_list(:user, 3)
      
      get '/api/users'
      
      expect(response.parsed_body.size).to eq(3)
    end
  end
end
```

### Testing Tools

| Tool | Purpose |
|------|---------|
| **RSpec** | BDD testing |
| **Factory Bot** | Test fixtures |
| **Shoulda Matchers** | Common matchers |
| **Capybara** | E2E testing |
| **SimpleCov** | Coverage |
| **VCR** | HTTP mocking |

---

## 6. Sidekiq Patterns

### Workers

```ruby
# app/workers/send_email_worker.rb
class SendEmailWorker
  include Sidekiq::Job
  
  sidekiq_options retry: 5, queue: 'mailers'
  
  def perform(user_id, template)
    user = User.find(user_id)
    UserMailer.send_template(user, template).deliver_now
  end
end

# Controller enqueuing
SendEmailWorker.perform_async(@user.id, 'welcome')
# or with delay
SendEmailWorker.perform_in(1.hour, @user.id, 'reminder')
```

### Testing

```ruby
# Testing Sidekiq workers
RSpec.describe SendEmailWorker do
  it 'sends email to user' do
    user = create(:user)
    
    expect { 
      SendEmailWorker.perform_async(user.id, 'welcome') 
    }.to change(Sidekiq::Worker.jobs, :size).by(1)
  end
end
```

---

## 7. Performance

### Caching

```ruby
# Fragment caching
<% cache @user do %>
  <div class="user"><%= @user.name %></div>
<% end %>

# Low-level caching
Rails.cache.fetch("user_#{user.id}", expires_in: 1.hour) do
  UserAPI.new.fetch_details(user.id)
end
```

### Query Optimization

```ruby
# N+1 problem - BAD
@users.each { |u| puts u.posts.count }

# Eager loading - GOOD
@users = User.includes(:posts).where(...)
@users.each { |u| puts u.posts.count }

# Select specifically - BETTER
@users = User.select(:id, :name).includes(:posts)
```

---

## 8. Decision Checklist

Before implementing:

- [ ] **Chosen web framework?**
- [ ] **Service objects for business logic?**
- [ ] **Hotwire for interactivity?**
- [ ] **Sidekiq for background jobs?**
- [ ] **RSpec for testing?**
- [ ] **Eager loading for queries?**
- [ ] **Caching strategy?**

---

## ❌ Anti-Patterns to Avoid

### ❌ DON'T:
- Use instance variables in views (@user)
- Put business logic in controllers
- Skip tests (RSpec is excellent)
- Use is_a? or kind_of? (use respond_to?)
- Create gems for small utilities

### ✅ DO:
- Use Service Objects
- Use Form Objects
- Use Command Pattern
- Use DHH's Hotwire approach
- Test with RSpec
- Use Solid preloaded gems

---

> **Remember:** Ruby is about productivity and developer happiness.
> Use Rails 7+ and modern patterns like Hotwire.
> **Think in Ruby.**