---
name: rails-patterns
description: Ruby on Rails 7+ patterns and conventions. Covers Hotwire, Turbo, Stimulus, Active Record, and modern Rails architecture.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: backend
---

# Rails Patterns

## What I Do

- Build Rails 7+ applications with Hotwire (Turbo + Stimulus)
- Design Active Record models with proper associations
- Implement background jobs with Sidekiq or Good Job
- Structure Rails applications for maintainability
- Apply Rails security best practices

## When to Use Me

- Creating or extending Rails applications
- Implementing Hotwire/Turbo features
- Designing database schemas with migrations
- Setting up background job processing
- Refactoring Rails code for maintainability

## Key Principles

1. **Fat Model, Skinny Controller**: Business logic in models/services
2. **Convention Over Configuration**: Follow Rails conventions
3. **Strong Parameters**: Always whitelist permitted params
4. **N+1 Prevention**: Use includes/eager_load for associations
5. **Service Objects**: Extract complex logic into PORO services

## Common Patterns

### Service Object
```ruby
class UserRegistrationService
  def initialize(params)
    @params = params
  end

  def call
    User.transaction do
      @user = User.new(@params)
      @user.save!
      UserMailer.welcome(@user).deliver_later
      @user
    end
  rescue ActiveRecord::RecordInvalid => e
    errors: e.record.errors
  end
end
```

### Turbo Frame
```erb
<%= turbo_frame_tag "messages" do %>
  <%= render @messages %>
  <%= link_to "Load more", messages_path(page: @page + 1),
      data: { turbo_frame: "messages" } %>
<% end %>
```

## Validation

```bash
bundle exec rails db:migrate
bundle exec rails test
bundle exec rubocop
```
