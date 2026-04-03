---
name: onboarding-flows
description: User onboarding patterns. Signup flow, activation, product tours, checklists, empty state onboarding.
---

# Onboarding Flows

> Onboarding ends when the user gets their first value. Not when they finish setup.

---

## 1. Onboarding Types

| Type | When | Example |
|------|------|---------|
| **Progressive** | Reveal features as needed | Notion |
| **Linear wizard** | Required setup steps | Stripe |
| **Checklist** | Optional but guided | Intercom |
| **Interactive demo** | Try before signup | Figma |
| **Blank canvas** | Minimal, user-driven | Linear |

---

## 2. The Activation Moment

```
"Aha moment" = first time user experiences core value

Examples:
├── GitHub: first commit pushed
├── Slack: first message sent to team
├── Spotify: first playlist created
├── Stripe: first test payment
└── Loom: first video recorded + shared

Goal: minimize time-to-aha
Everything else is noise.
```

---

## 3. Signup Flow Design

```
Principles:
├── Collect minimum required info (email + password, or OAuth)
├── No credit card upfront (unless required by business)
├── Skip optional profile completion
├── Verify email but let user continue (async verify)
└── Show value immediately after signup

Friction reducers:
├── Social login (Google, GitHub, Slack)
├── Single-click OAuth where possible
├── Magic link instead of password
└── Pre-fill with LinkedIn/Google data
```

---

## 4. Checklist Pattern

```tsx
const onboardingSteps = [
  { id: "profile", label: "Complete your profile", completed: user.profileComplete },
  { id: "invite",  label: "Invite a teammate",     completed: user.hasInvited },
  { id: "project", label: "Create first project",  completed: user.hasProject },
  { id: "connect", label: "Connect your tools",    completed: user.hasIntegration },
];

function OnboardingChecklist() {
  const completedCount = onboardingSteps.filter(s => s.completed).length;
  const progress = (completedCount / onboardingSteps.length) * 100;

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-1">Get started with MyApp</h3>
      <p className="text-sm text-gray-500 mb-4">{completedCount} of {onboardingSteps.length} complete</p>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {onboardingSteps.map(step => (
        <div key={step.id} className="flex items-center gap-3 py-2">
          <CheckCircle className={step.completed ? "text-green-500" : "text-gray-300"} />
          <span className={step.completed ? "line-through text-gray-400" : "text-gray-700"}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Product Tour

```tsx
// Use Shepherd.js, intro.js, or Joyride
import Joyride from "react-joyride";

const steps = [
  {
    target: "[data-tour=\'sidebar\']",
    content: "Navigate between your projects here.",
    placement: "right",
  },
  {
    target: "[data-tour=\'new-task\']",
    content: "Click here to create your first task.",
    placement: "bottom",
  },
];

function App() {
  const [runTour, setRunTour] = useState(!user.hasCompletedTour);

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        callback={({ status }) => {
          if (["finished", "skipped"].includes(status)) {
            markTourComplete(user.id);
            setRunTour(false);
          }
        }}
      />
      {/* App */}
    </>
  );
}
```

---

## 6. Onboarding Emails

```
Day 0 (immediate): Welcome + what to do first
Day 1: Tips to get value faster
Day 3: "Did you try X?" (if not activated)
Day 7: Success stories / templates
Day 14: Check-in / offer help
```

---

## 7. Activation Metrics

```
Track:
├── Time to first key action (median + p90)
├── Activation rate = users who hit aha / signed up
├── Funnel: signup → step 1 → step 2 → activated
├── Drop-off by step
└── Cohort retention (D1, D7, D30)

Intervention triggers:
├── No action after 1 hour → trigger email
├── Stuck on step → show help tooltip
└── Day 3 not activated → assign to CS team
```

---

## 8. Anti-Patterns

| ❌ Don\'t | ✅ Do |
|----------|-------|
| Collect all info upfront | Progressive disclosure |
| Long wizard (> 5 steps) | Minimize to essential |
| Force profile completion | Let user explore first |
| Generic welcome email | Personalized with what they signed up for |
| No progress indicator | Show X of Y steps |
| No skip option | Always allow skipping non-critical steps |
