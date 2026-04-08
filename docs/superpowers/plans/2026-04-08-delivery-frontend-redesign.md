# Delivery Frontend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing custom CSS + emoji-based UI with a professional Dark Pro design using Tailwind CSS, shadcn/ui, and lucide-react icons, adding a Dashboard page and rewriting all 8 pages.

**Architecture:** Sidebar layout (220px fixed) + main area with topbar. React Router v6 replaces the current useState-based navigation. All existing services (`orderService`, `customerService`, etc.) and types remain untouched — only the UI layer changes.

**Tech Stack:** React 19, Vite, TypeScript 5.9, Tailwind CSS v3, shadcn/ui (Radix UI), lucide-react, react-router-dom v6

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | modify | add tailwindcss, postcss, autoprefixer, lucide-react, react-router-dom |
| `tailwind.config.js` | create | content paths, darkMode: 'class', zinc/indigo theme extend |
| `postcss.config.js` | create | tailwind + autoprefixer plugins |
| `components.json` | create | shadcn/ui config |
| `src/index.css` | rewrite | Tailwind directives + shadcn CSS variables |
| `src/main.tsx` | modify | wrap app in `<BrowserRouter>` |
| `src/App.tsx` | rewrite | sidebar + topbar layout, React Router routes |
| `src/components/ui/` | create | shadcn-generated: button, card, badge, table, input, select, tabs |
| `src/components/PatternBadge.tsx` | create | indigo badge showing pattern name |
| `src/components/StatusStepper.tsx` | rewrite | Tailwind-based 5-step stepper |
| `src/components/StatChip.tsx` | rewrite | Tailwind-based stat chip |
| `src/components/KpiCard.tsx` | create | metric card with value/label/delta |
| `src/components/PageHeader.tsx` | create | topbar title + breadcrumb + action slot |
| `src/components/DataTable.tsx` | create | generic table shell |
| `src/pages/DashboardPage.tsx` | create | 4 KPI cards + Recent Orders table |
| `src/pages/OrdersPage.tsx` | rewrite | card grid, stepper, clone button |
| `src/pages/CustomersPage.tsx` | rewrite | search + table |
| `src/pages/CouriersPage.tsx` | rewrite | vehicle badges, factory/flyweight |
| `src/pages/DeliveriesPage.tsx` | rewrite | delivery table, compact stepper |
| `src/pages/PlaceOrderPage.tsx` | rewrite | composite tree + facade form + adapter payment |
| `src/pages/ReportsPage.tsx` | rewrite | KPI row + charts + bridge renderer toggle |
| `src/pages/ProtectedOrdersPage.tsx` | rewrite | proxy role selector + conditional table |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install Tailwind + PostCSS toolchain**

```bash
cd delivery-frontend
npm install -D tailwindcss@3 postcss autoprefixer
```

Expected: packages added to devDependencies.

- [ ] **Step 2: Install shadcn peer dependencies and lucide + router**

```bash
npm install lucide-react react-router-dom
npm install class-variance-authority clsx tailwind-merge @radix-ui/react-slot
npm install @radix-ui/react-select @radix-ui/react-tabs
```

- [ ] **Step 3: Verify no install errors**

```bash
npm ls --depth=0 2>&1 | head -30
```

Expected: no `UNMET` or `peer dep` warnings for the packages above.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install tailwind css, shadcn deps, lucide-react, react-router-dom"
```

---

## Task 2: Configure Tailwind CSS + PostCSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Create `components.json` (shadcn config)**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 4: Update `vite.config.ts` to add path alias**

Replace full file content:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: Update `tsconfig.app.json` — add paths**

Add inside `compilerOptions`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js postcss.config.js components.json vite.config.ts tsconfig.app.json
git commit -m "chore: configure tailwind css and postcss, add path aliases"
```

---

## Task 3: Create `src/lib/utils.ts` + Replace `src/index.css`

**Files:**
- Create: `src/lib/utils.ts`
- Rewrite: `src/index.css`

- [ ] **Step 1: Create `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Replace full content of `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', ui-sans-serif, system-ui, sans-serif;
    font-size: 13px;
  }
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils.ts src/index.css
git commit -m "chore: add shadcn css variables and tailwind base styles"
```

---

## Task 4: Create shadcn/ui component files

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/table.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/tabs.tsx`

- [ ] **Step 1: Create `src/components/ui/button.tsx`**

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 2: Create `src/components/ui/card.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
```

- [ ] **Step 3: Create `src/components/ui/badge.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-emerald-500/20 text-emerald-400',
        warning: 'border-transparent bg-yellow-500/20 text-yellow-400',
        indigo: 'border-transparent bg-indigo-500/20 text-indigo-400',
        orange: 'border-transparent bg-orange-500/20 text-orange-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 4: Create `src/components/ui/table.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b border-border transition-colors hover:bg-muted/30', className)}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('h-9 px-4 text-left align-middle text-xs font-medium text-muted-foreground uppercase tracking-wider', className)}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-2.5 align-middle text-sm', className)} {...props} />
  )
)
TableCell.displayName = 'TableCell'

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
```

- [ ] **Step 5: Create `src/components/ui/input.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 6: Create `src/components/ui/select.tsx`**

```tsx
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-zinc-900 text-foreground shadow-md',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
```

- [ ] **Step 7: Create `src/components/ui/tabs.tsx`**

```tsx
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

- [ ] **Step 8: Type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/ src/lib/
git commit -m "chore: add shadcn ui base components (button, card, badge, table, input, select, tabs)"
```

---

## Task 5: Create shared components

**Files:**
- Create: `src/components/PatternBadge.tsx`
- Rewrite: `src/components/StatusStepper.tsx`
- Rewrite: `src/components/StatChip.tsx`
- Create: `src/components/KpiCard.tsx`
- Create: `src/components/PageHeader.tsx`

- [ ] **Step 1: Create `src/components/PatternBadge.tsx`**

```tsx
import { cn } from '@/lib/utils'

interface PatternBadgeProps {
  pattern: string
  className?: string
}

export default function PatternBadge({ pattern, className }: PatternBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/30',
        className
      )}
    >
      {pattern}
    </span>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/StatusStepper.tsx`**

```tsx
import { cn } from '@/lib/utils'

interface StatusStepperProps {
  steps: string[]
  current: string
  failed?: boolean
  compact?: boolean
}

export default function StatusStepper({ steps, current, failed = false, compact = false }: StatusStepperProps) {
  const currentIdx = steps.findIndex(s => s.toLowerCase() === current.toLowerCase())

  return (
    <div className={cn('flex items-center gap-0', compact ? 'text-[10px]' : 'text-xs')}>
      {steps.map((step, i) => {
        const isDone = i < currentIdx
        const isActive = i === currentIdx
        const isFailed = failed && isActive

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'rounded-full border-2',
                  compact ? 'h-2 w-2' : 'h-3 w-3',
                  isDone && 'border-indigo-500 bg-indigo-500',
                  isActive && !isFailed && 'border-indigo-400 bg-indigo-400/30',
                  isFailed && 'border-red-500 bg-red-500/30',
                  !isDone && !isActive && 'border-zinc-700 bg-transparent'
                )}
              />
              {!compact && (
                <span
                  className={cn(
                    'whitespace-nowrap',
                    isDone && 'text-indigo-400',
                    isActive && !isFailed && 'text-zinc-200',
                    isFailed && 'text-red-400',
                    !isDone && !isActive && 'text-zinc-600'
                  )}
                >
                  {step}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-px mx-1', compact ? 'w-3' : 'w-6', isDone ? 'bg-indigo-500' : 'bg-zinc-800')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Rewrite `src/components/StatChip.tsx`**

```tsx
import { cn } from '@/lib/utils'

interface StatChipProps {
  label: string
  value: string | number
  color?: 'default' | 'success' | 'warning' | 'danger' | 'accent'
}

const colorMap = {
  default: 'bg-zinc-800/60 text-zinc-400',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  danger: 'bg-red-500/15 text-red-400',
  accent: 'bg-indigo-500/15 text-indigo-400',
}

export default function StatChip({ label, value, color = 'default' }: StatChipProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs', colorMap[color])}>
      <span className="font-semibold">{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/KpiCard.tsx`**

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  icon: LucideIcon
}

export default function KpiCard({ title, value, delta, deltaUp, icon: Icon }: KpiCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-zinc-50">{value}</p>
            {delta && (
              <p className={cn('mt-1 text-xs', deltaUp ? 'text-emerald-400' : 'text-red-400')}>
                {delta}
              </p>
            )}
          </div>
          <div className="rounded-md bg-zinc-800 p-2">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5: Create `src/components/PageHeader.tsx`**

```tsx
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-50">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
```

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/PatternBadge.tsx src/components/StatusStepper.tsx src/components/StatChip.tsx src/components/KpiCard.tsx src/components/PageHeader.tsx
git commit -m "refactor: rewrite shared components with tailwind, add PatternBadge and KpiCard"
```

---

## Task 6: Rewrite `src/main.tsx` + `src/App.tsx`

**Files:**
- Modify: `src/main.tsx`
- Rewrite: `src/App.tsx`

- [ ] **Step 1: Update `src/main.tsx` — wrap in BrowserRouter**

Current file imports ReactDOM and App. Add BrowserRouter:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Rewrite `src/App.tsx`**

```tsx
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingCart, Users, Bike, Truck,
  PackagePlus, BarChart2, ShieldCheck,
  Layers, GitBranch, Factory, Combine, Puzzle,
  TreePine, Component, Repeat, Maximize2, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import CouriersPage from './pages/CouriersPage'
import DeliveriesPage from './pages/DeliveriesPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import ReportsPage from './pages/ReportsPage'
import ProtectedOrdersPage from './pages/ProtectedOrdersPage'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  pattern?: string
}

const NAV_OPERATIONS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/couriers', label: 'Couriers', icon: Bike },
  { to: '/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/place-order', label: 'Place Order', icon: PackagePlus },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/protected-orders', label: 'Protected Orders', icon: ShieldCheck },
]

const NAV_LAB4: NavItem[] = [
  { to: '/orders', label: 'Prototype', icon: Layers, pattern: 'Prototype' },
  { to: '/orders', label: 'Builder', icon: GitBranch, pattern: 'Builder' },
  { to: '/couriers', label: 'Factory Method', icon: Factory, pattern: 'Factory' },
  { to: '/place-order', label: 'Facade', icon: Combine, pattern: 'Façade' },
  { to: '/place-order', label: 'Adapter', icon: Puzzle, pattern: 'Adapter' },
  { to: '/place-order', label: 'Composite', icon: TreePine, pattern: 'Composite' },
  { to: '/reports', label: 'Bridge', icon: Component, pattern: 'Bridge' },
  { to: '/protected-orders', label: 'Proxy', icon: ShieldCheck, pattern: 'Proxy' },
  { to: '/couriers', label: 'Flyweight', icon: Repeat, pattern: 'Flyweight' },
  { to: '/deliveries', label: 'Decorator', icon: Sparkles, pattern: 'Decorator' },
]

const NAV_LAB5: NavItem[] = [
  { to: '/orders', label: 'Observer', icon: Maximize2, pattern: 'Observer' },
]

function SidebarSection({ title, items }: { title: string; items: NavItem[] }) {
  const location = useLocation()
  return (
    <div className="mb-4">
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {title}
      </p>
      {items.map(item => {
        const Icon = item.icon
        const isActive = item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={cn(
              'flex items-center gap-2.5 rounded-md mx-1 px-2.5 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.pattern && (
              <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-400">
                {item.pattern}
              </span>
            )}
          </NavLink>
        )
      })}
    </div>
  )
}

export default function App() {
  const location = useLocation()

  const pageTitle = (() => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path === '/orders') return 'Orders'
    if (path === '/customers') return 'Customers'
    if (path === '/couriers') return 'Couriers'
    if (path === '/deliveries') return 'Deliveries'
    if (path === '/place-order') return 'Place Order'
    if (path === '/reports') return 'Reports'
    if (path === '/protected-orders') return 'Protected Orders'
    return 'Delivery System'
  })()

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
            <Truck className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-zinc-100">DeliveryOS</p>
            <p className="text-[10px] text-zinc-600 leading-none mt-0.5">Pattern Explorer</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          <SidebarSection title="Operations" items={NAV_OPERATIONS} />
          <SidebarSection title="Lab 4 — Structural" items={NAV_LAB4} />
          <SidebarSection title="Lab 5 — Behavioral" items={NAV_LAB5} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-12 shrink-0 items-center border-b border-zinc-800 bg-zinc-950 px-6">
          <span className="text-sm font-medium text-zinc-400">DeliveryOS</span>
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-sm font-medium text-zinc-100">{pageTitle}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/couriers" element={<CouriersPage />} />
            <Route path="/deliveries" element={<DeliveriesPage />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/protected-orders" element={<ProtectedOrdersPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors (DashboardPage doesn't exist yet — create a stub if needed: `export default function DashboardPage() { return <div /> }`).

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat: redesign app layout with dark sidebar and react router"
```

---

## Task 7: Create `DashboardPage`

**Files:**
- Create: `src/pages/DashboardPage.tsx`

- [ ] **Step 1: Create `src/pages/DashboardPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Package, Truck, Users, Clock } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import PageHeader from '@/components/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import { courierService } from '@/services/courierService'
import type { Order, Customer, Courier } from '@/types'

function statusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'success'
  if (s === 'cancelled' || s === 'failed') return 'destructive'
  if (s === 'processing' || s === 'readyfordelivery') return 'warning'
  return 'secondary'
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), customerService.getAll(), courierService.getAll()])
      .then(([o, c, cr]) => { setOrders(o); setCustomers(c); setCouriers(cr) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length
  const inTransit = orders.filter(o => o.status === 'ReadyForDelivery').length
  const available = couriers.filter(c => c.isAvailable).length
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))

  return (
    <div>
      <PageHeader title="Dashboard" description="System overview" />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard title="Active Orders" value={active} delta="+12% vs last week" deltaUp icon={Package} />
        <KpiCard title="In Transit" value={inTransit} icon={Truck} />
        <KpiCard title="Available Couriers" value={available} icon={Users} />
        <KpiCard title="Avg Delivery Time" value="24 min" delta="+3 min" deltaUp={false} icon={Clock} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Recent Orders</h2>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map(order => (
                <TableRow key={order.id} className="border-zinc-800/50">
                  <TableCell className="font-mono text-xs text-zinc-400">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell className="text-zinc-300">{customerMap[order.customerId] ?? order.customerId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{order.priority}</TableCell>
                  <TableCell className="text-zinc-300">RON {order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-600 py-8">No orders yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add `courierService` to services if missing**

Check `src/services/courierService.ts` exists. If it does, skip. If not:

```ts
import { api } from './api'
import type { Courier, CreateCourierRequest } from '../types'

export const courierService = {
  getAll: () => api.get<Courier[]>('/couriers'),
  getById: (id: string) => api.get<Courier>(`/couriers/${id}`),
  create: (data: CreateCourierRequest) => api.post<Courier>('/couriers', data),
  setAvailable: (id: string, available: boolean) => api.put<Courier>(`/couriers/${id}/availability`, { available }),
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: add dashboard page with kpi cards and recent orders table"
```

---

## Task 8: Rewrite `OrdersPage`

**Files:**
- Rewrite: `src/pages/OrdersPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/OrdersPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Copy, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import StatusStepper from '@/components/StatusStepper'
import StatChip from '@/components/StatChip'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import type { Order, Customer } from '@/types'

const ORDER_STEPS = ['Created', 'Confirmed', 'Processing', 'ReadyForDelivery', 'Delivered']

function priorityVariant(p: string): 'warning' | 'destructive' | 'secondary' {
  if (p === 'High') return 'destructive'
  if (p === 'Normal') return 'secondary'
  return 'warning'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')

  const load = () =>
    Promise.all([orderService.getAll(), customerService.getAll()])
      .then(([o, c]) => { setOrders(o); setCustomers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))

  useEffect(() => { load() }, [])

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))

  const handleClone = async (id: string) => {
    try { await orderService.clone(id); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Clone failed') }
  }

  const handleCancel = async (id: string) => {
    try { await orderService.cancel(id); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Cancel failed') }
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        actions={
          <div className="flex items-center gap-2">
            <PatternBadge pattern="Prototype" />
            <PatternBadge pattern="Builder" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {orders.map(order => (
          <Card key={order.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-zinc-100">
                    {customerMap[order.customerId] ?? 'Unknown Customer'}
                  </CardTitle>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{order.id}</p>
                </div>
                <Badge variant={priorityVariant(order.priority)}>{order.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {/* Builder pattern: stepper */}
              <div className="mb-3 overflow-x-auto">
                <StatusStepper
                  steps={ORDER_STEPS}
                  current={order.status}
                  failed={order.status === 'Cancelled'}
                />
              </div>

              {/* Stat chips */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                <StatChip label="items" value={order.items.length} color="default" />
                <StatChip label="RON" value={order.totalPrice.toFixed(2)} color="accent" />
                <StatChip label="kg" value={order.totalWeight.toFixed(1)} color="default" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 border-zinc-700 text-xs">
                  <Eye className="h-3 w-3" /> View
                </Button>
                {/* Prototype pattern: clone */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-indigo-800 text-indigo-400 hover:bg-indigo-500/10 text-xs"
                  onClick={() => handleClone(order.id)}
                >
                  <Copy className="h-3 w-3" /> Clone
                </Button>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-800 text-xs"
                    onClick={() => handleCancel(order.id)}
                  >
                    <X className="h-3 w-3" /> Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-zinc-600 col-span-2 py-12 text-center">No orders found</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/OrdersPage.tsx
git commit -m "feat: redesign orders page with stepper, clone action, and pattern badges"
```

---

## Task 9: Rewrite `CustomersPage`

**Files:**
- Rewrite: `src/pages/CustomersPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/CustomersPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import { customerService } from '@/services/customerService'
import { orderService } from '@/services/orderService'
import type { Customer, Order } from '@/types'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([customerService.getAll(), orderService.getAll()])
      .then(([c, o]) => { setCustomers(c); setOrders(o) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const orderCount = (id: string) => orders.filter(o => o.customerId === id).length

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Customers" description="All registered customers" />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <Input
            placeholder="Search customers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-zinc-900 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 h-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="border-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">{c.name}</TableCell>
                <TableCell className="text-zinc-400">{c.email}</TableCell>
                <TableCell className="text-zinc-400">{c.phone}</TableCell>
                <TableCell className="text-zinc-500">{c.address.city}</TableCell>
                <TableCell>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                    {orderCount(c.id)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-600 py-8">No customers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/CustomersPage.tsx
git commit -m "feat: redesign customers page with search and table"
```

---

## Task 10: Rewrite `CouriersPage`

**Files:**
- Rewrite: `src/pages/CouriersPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/CouriersPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { courierService } from '@/services/courierService'
import type { Courier } from '@/types'

function vehicleVariant(v: string): 'indigo' | 'success' | 'warning' | 'secondary' {
  if (v === 'Bicycle') return 'indigo'
  if (v === 'Car') return 'success'
  if (v === 'Drone') return 'warning'
  return 'secondary'
}

function statusVariant(available: boolean): 'success' | 'secondary' {
  return available ? 'success' : 'secondary'
}

export default function CouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    courierService.getAll()
      .then(setCouriers)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  return (
    <div>
      <PageHeader
        title="Couriers"
        description="Fleet management — vehicle factory and flyweight metadata"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Factory Method" />
            <PatternBadge pattern="Flyweight" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Max Weight</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couriers.map(c => (
              <TableRow key={c.id} className="border-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">{c.name}</TableCell>
                <TableCell className="text-zinc-400">{c.phone}</TableCell>
                <TableCell>
                  <Badge variant={vehicleVariant(c.vehicleType)}>{c.vehicleType}</Badge>
                </TableCell>
                <TableCell className="text-zinc-400">{c.maxWeight} kg</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(c.isAvailable)}>
                    {c.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {couriers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-600 py-8">No couriers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/CouriersPage.tsx
git commit -m "feat: redesign couriers page with vehicle badges and pattern labels"
```

---

## Task 11: Rewrite `DeliveriesPage`

**Files:**
- Rewrite: `src/pages/DeliveriesPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/DeliveriesPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import StatusStepper from '@/components/StatusStepper'
import { deliveryService } from '@/services/deliveryService'
import { courierService } from '@/services/courierService'
import type { Delivery, Courier } from '@/types'

const DELIVERY_STEPS = ['Assigned', 'PickedUp', 'Delivered']

function statusVariant(s: string): 'success' | 'warning' | 'secondary' {
  if (s === 'Delivered') return 'success'
  if (s === 'PickedUp') return 'warning'
  return 'secondary'
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([deliveryService.getAll(), courierService.getAll()])
      .then(([d, c]) => { setDeliveries(d); setCouriers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const courierMap = Object.fromEntries(couriers.map(c => [c.id, c.name]))

  return (
    <div>
      <PageHeader
        title="Deliveries"
        description="Active and completed delivery tracking"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Facade" />
            <PatternBadge pattern="Decorator" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Delivery ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map(d => (
              <TableRow key={d.id} className="border-zinc-800/50">
                <TableCell className="font-mono text-[11px] text-zinc-500">{d.id.slice(0, 8)}…</TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-400">{d.orderId.slice(0, 8)}…</TableCell>
                <TableCell className="text-zinc-300">{courierMap[d.courierId] ?? d.courierId.slice(0, 8)}</TableCell>
                <TableCell>
                  <StatusStepper steps={DELIVERY_STEPS} current={d.status} compact />
                </TableCell>
                <TableCell className="text-zinc-400">{d.distanceKm} km</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {deliveries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-600 py-8">No deliveries found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Check `deliveryService` has `getAll`**

Open `src/services/deliveryService.ts`. Confirm it exports `deliveryService.getAll()`. If not, add:

```ts
getAll: () => api.get<Delivery[]>('/deliveries'),
```

- [ ] **Step 3: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/DeliveriesPage.tsx src/services/deliveryService.ts
git commit -m "feat: redesign deliveries page with compact stepper and pattern badges"
```

---

## Task 12: Rewrite `PlaceOrderPage`

**Files:**
- Rewrite: `src/pages/PlaceOrderPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/PlaceOrderPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Minus, CreditCard, Banknote, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { catalogService } from '@/services/catalogService'
import { customerService } from '@/services/customerService'
import { orderService } from '@/services/orderService'
import type { CatalogNode, Customer, PlaceOrderItemDto } from '@/types'

interface CartItem extends PlaceOrderItemDto {
  key: string
}

function CatalogTree({ node, onAdd, depth = 0 }: { node: CatalogNode; onAdd: (name: string, price: number) => void; depth?: number }) {
  const [open, setOpen] = useState(depth === 0)
  const isLeaf = node.children.length === 0

  if (isLeaf) {
    return (
      <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-zinc-800/50 group">
        <span className="text-sm text-zinc-400 group-hover:text-zinc-200">{node.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">RON {node.totalPrice.toFixed(2)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-600 hover:text-indigo-400"
            onClick={() => onAdd(node.name, node.totalPrice)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-zinc-800/50"
        onClick={() => setOpen(o => !o)}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {open ? <ChevronDown className="h-3 w-3 text-zinc-600" /> : <ChevronRight className="h-3 w-3 text-zinc-600" />}
        <span className="text-sm font-medium text-zinc-300">{node.name}</span>
      </button>
      {open && (
        <div style={{ paddingLeft: `${depth * 12}px` }}>
          {node.children.map(child => (
            <CatalogTree key={child.name} node={child} onAdd={onAdd} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

type PaymentGateway = 'Cash' | 'Card' | 'DigitalWallet'

export default function PlaceOrderPage() {
  const [catalog, setCatalog] = useState<CatalogNode | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [payment, setPayment] = useState<PaymentGateway>('Cash')
  const [cardNumber, setCardNumber] = useState('')
  const [walletId, setWalletId] = useState('')
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([catalogService.getTree(), customerService.getAll()])
      .then(([c, custs]) => { setCatalog(c); setCustomers(custs) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const addToCart = (name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productName === name)
      if (existing) return prev.map(i => i.productName === name ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { key: name, productName: name, quantity: 1, unitPrice: price, weight: 0.5 }]
    })
  }

  const removeFromCart = (name: string) => {
    setCart(prev => {
      const item = prev.find(i => i.productName === name)
      if (!item) return prev
      if (item.quantity > 1) return prev.map(i => i.productName === name ? { ...i, quantity: i.quantity - 1 } : i)
      return prev.filter(i => i.productName !== name)
    })
  }

  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  const handleSubmit = async () => {
    try {
      const res = await orderService.place({
        customerId,
        items: cart,
        paymentGateway: payment,
        deliveryNotes: notes || undefined,
      })
      setResult(res.success ? `Order placed: ${res.orderId?.slice(0, 8)}` : res.message)
      if (res.success) { setCart([]); setCustomerId(''); setNotes('') }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to place order')
    }
  }

  return (
    <div>
      <PageHeader
        title="Place Order"
        description="Composite catalog + Facade order service + Adapter payment"
        actions={
          <div className="flex gap-2">
            <PatternBadge pattern="Composite" />
            <PatternBadge pattern="Facade" />
            <PatternBadge pattern="Adapter" />
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {result && <p className="mb-4 text-sm text-emerald-400">{result}</p>}

      <div className="grid grid-cols-5 gap-6">
        {/* Composite catalog tree */}
        <Card className="col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Product Catalog</CardTitle>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Composite pattern</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {catalog ? (
              <CatalogTree node={catalog} onAdd={addToCart} />
            ) : (
              <p className="text-center text-zinc-600 text-sm py-4">Loading…</p>
            )}
          </CardContent>
        </Card>

        {/* Facade order form */}
        <Card className="col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Order Form</CardTitle>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Facade + Adapter</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Customer</label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="bg-zinc-950 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Select customer…" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cart items */}
            {cart.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Selected Items</label>
                <div className="space-y-1">
                  {cart.map(item => (
                    <div key={item.key} className="flex items-center justify-between rounded bg-zinc-950 px-3 py-1.5">
                      <span className="text-sm text-zinc-300">{item.productName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">RON {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => removeFromCart(item.productName)} className="text-zinc-600 hover:text-zinc-300">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs text-zinc-300">{item.quantity}</span>
                          <button onClick={() => addToCart(item.productName, item.unitPrice)} className="text-zinc-600 hover:text-zinc-300">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end px-3 pt-1">
                    <span className="text-sm font-semibold text-zinc-200">Total: RON {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Adapter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Payment Method (Adapter)</label>
              <div className="flex gap-2 mb-2">
                {(['Cash', 'Card', 'DigitalWallet'] as PaymentGateway[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setPayment(m)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      payment === m
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                    }`}
                  >
                    {m === 'Cash' && <Banknote className="h-3 w-3" />}
                    {m === 'Card' && <CreditCard className="h-3 w-3" />}
                    {m === 'DigitalWallet' && <Wallet className="h-3 w-3" />}
                    {m === 'DigitalWallet' ? 'Wallet' : m}
                  </button>
                ))}
              </div>
              {payment === 'Card' && (
                <Input
                  placeholder="Card number…"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
                />
              )}
              {payment === 'DigitalWallet' && (
                <Input
                  placeholder="Wallet ID…"
                  value={walletId}
                  onChange={e => setWalletId(e.target.value)}
                  className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
                />
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">Delivery Notes (optional)</label>
              <Input
                placeholder="Leave at door…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 h-8 text-xs"
              />
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              disabled={!customerId || cart.length === 0}
              onClick={handleSubmit}
            >
              Place Order via Facade
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify `catalogService.getTree()` exists**

Check `src/services/catalogService.ts`. If it exports `getTree()` returning `CatalogNode`, proceed. If the method name differs, adjust the import accordingly.

- [ ] **Step 3: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/PlaceOrderPage.tsx
git commit -m "feat: redesign place order page with composite catalog, facade form, adapter payment"
```

---

## Task 13: Rewrite `ReportsPage`

**Files:**
- Rewrite: `src/pages/ReportsPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/ReportsPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import KpiCard from '@/components/KpiCard'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { orderService } from '@/services/orderService'
import { courierService } from '@/services/courierService'
import type { Order, Courier } from '@/types'
import { Package, TrendingUp, Clock, DollarSign } from 'lucide-react'

/* Bridge: renderer implementations */
function TableRenderer({ orders, courierMap }: { orders: Order[]; courierMap: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total (RON)</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.slice(0, 20).map(o => (
            <TableRow key={o.id} className="border-zinc-800/50">
              <TableCell className="font-mono text-xs text-zinc-500">{o.id.slice(0, 8)}…</TableCell>
              <TableCell className="text-zinc-400">{courierMap[o.customerId] ?? o.customerId.slice(0, 8)}</TableCell>
              <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
              <TableCell className="text-zinc-300">{o.totalPrice.toFixed(2)}</TableCell>
              <TableCell className="text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function BarRenderer({ orders }: { orders: Order[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const count = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString()).length
    return { label, count }
  })
  const max = Math.max(...days.map(d => d.count), 1)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Orders per day (last 7)</p>
      <div className="flex items-end gap-3 h-32">
        {days.map(d => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-zinc-400">{d.count}</span>
            <div
              className="w-full rounded-t bg-indigo-500"
              style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-zinc-600">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutRenderer({ orders }: { orders: Order[] }) {
  const delivered = orders.filter(o => o.status === 'Delivered').length
  const inTransit = orders.filter(o => ['Processing', 'ReadyForDelivery'].includes(o.status)).length
  const failed = orders.filter(o => o.status === 'Cancelled').length
  const total = orders.length || 1

  const segments = [
    { label: 'Delivered', count: delivered, pct: ((delivered / total) * 100).toFixed(0), color: 'bg-indigo-500' },
    { label: 'In Transit', count: inTransit, pct: ((inTransit / total) * 100).toFixed(0), color: 'bg-emerald-500' },
    { label: 'Cancelled', count: failed, pct: ((failed / total) * 100).toFixed(0), color: 'bg-red-500' },
  ]

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 flex items-center gap-8">
      <div
        className="h-28 w-28 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(
            #6366f1 0% ${(delivered / total) * 100}%,
            #22c55e ${(delivered / total) * 100}% ${((delivered + inTransit) / total) * 100}%,
            #ef4444 ${((delivered + inTransit) / total) * 100}% 100%
          )`,
        }}
      />
      <div className="space-y-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
            <span className="text-zinc-400">{s.label}</span>
            <span className="font-semibold text-zinc-200">{s.pct}%</span>
            <span className="text-zinc-600 text-xs">({s.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), courierService.getAll()])
      .then(([o, c]) => { setOrders(o); setCouriers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const courierMap = Object.fromEntries(couriers.map(c => [c.id, c.name]))
  const delivered = orders.filter(o => o.status === 'Delivered').length
  const deliveryRate = orders.length ? ((delivered / orders.length) * 100).toFixed(1) : '0'
  const revenue = orders.reduce((s, o) => s + o.totalPrice, 0)

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analytics and statistics — Bridge renderer pattern"
        actions={
          <div className="flex items-center gap-2">
            <PatternBadge pattern="Bridge" />
            <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-xs gap-1.5">
              <Download className="h-3 w-3" /> Export CSV
            </Button>
          </div>
        }
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Orders" value={orders.length} delta="+12% vs last month" deltaUp icon={Package} />
        <KpiCard title="Delivery Rate" value={`${deliveryRate}%`} deltaUp icon={TrendingUp} />
        <KpiCard title="Avg Delivery Time" value="24 min" icon={Clock} />
        <KpiCard title="Revenue" value={`RON ${revenue.toFixed(0)}`} delta="+8.7%" deltaUp icon={DollarSign} />
      </div>

      {/* Bridge: renderer toggle */}
      <div className="mb-1 flex items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Renderer (Bridge abstraction):</p>
      </div>
      <Tabs defaultValue="table" className="mt-0">
        <TabsList className="mb-4 bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="table" className="text-xs">Table</TabsTrigger>
          <TabsTrigger value="bar" className="text-xs">Bar Chart</TabsTrigger>
          <TabsTrigger value="donut" className="text-xs">Donut</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <TableRenderer orders={orders} courierMap={courierMap} />
        </TabsContent>
        <TabsContent value="bar">
          <BarRenderer orders={orders} />
        </TabsContent>
        <TabsContent value="donut">
          <DonutRenderer orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/ReportsPage.tsx
git commit -m "feat: add reports page with bridge renderer toggle (table/bar/donut)"
```

---

## Task 14: Rewrite `ProtectedOrdersPage`

**Files:**
- Rewrite: `src/pages/ProtectedOrdersPage.tsx`

- [ ] **Step 1: Rewrite `src/pages/ProtectedOrdersPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import PageHeader from '@/components/PageHeader'
import PatternBadge from '@/components/PatternBadge'
import { orderService } from '@/services/orderService'
import { customerService } from '@/services/customerService'
import type { Order, Customer } from '@/types'
import { cn } from '@/lib/utils'

type Role = 'Admin' | 'Courier' | 'None'

/* Proxy: access control check */
function proxyAccess(role: Role, orderId: string): boolean {
  if (role === 'Admin') return true
  if (role === 'Courier') return orderId.charCodeAt(0) % 2 === 0 // simulate: courier sees subset
  return false
}

export default function ProtectedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [role, setRole] = useState<Role>('None')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([orderService.getAll(), customerService.getAll()])
      .then(([o, c]) => { setOrders(o); setCustomers(c) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]))
  const visible = orders.filter(o => proxyAccess(role, o.id))

  return (
    <div>
      <PageHeader
        title="Protected Orders"
        description="Role-based access via Proxy pattern"
        actions={<PatternBadge pattern="Proxy" />}
      />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {/* Role selector */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Role:</span>
        {(['Admin', 'Courier', 'None'] as Role[]).map(r => (
          <Button
            key={r}
            onClick={() => setRole(r)}
            variant="outline"
            size="sm"
            className={cn(
              'h-8 gap-1.5 border text-xs transition-colors',
              role === r
                ? r === 'Admin'
                  ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                  : r === 'Courier'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                : 'border-zinc-800 text-zinc-600 hover:border-zinc-700'
            )}
          >
            {r === 'Admin' && <ShieldCheck className="h-3 w-3" />}
            {r === 'Courier' && <ShieldAlert className="h-3 w-3" />}
            {r === 'None' && <ShieldOff className="h-3 w-3" />}
            {r}
          </Button>
        ))}
      </div>

      {role === 'None' ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-orange-900/40 bg-orange-950/20 py-16">
          <ShieldOff className="h-8 w-8 text-orange-600 mb-3" />
          <p className="text-sm font-semibold text-orange-400">Access Denied</p>
          <p className="mt-1 text-xs text-zinc-600">Select a role to view orders. Proxy blocked this request.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          {role === 'Admin' && (
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-orange-950/10 px-4 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs text-orange-400 font-medium">Admin view — all columns visible including sensitive data</span>
            </div>
          )}
          {role === 'Courier' && (
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-indigo-950/10 px-4 py-2">
              <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs text-indigo-400 font-medium">Courier view — assigned orders only, customer contact redacted</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>Order ID</TableHead>
                {role === 'Admin' && <TableHead>Customer</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Total</TableHead>
                {role === 'Admin' && <TableHead>Notes</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(o => (
                <TableRow key={o.id} className="border-zinc-800/50">
                  <TableCell className="font-mono text-xs text-zinc-500">{o.id.slice(0, 8)}…</TableCell>
                  {role === 'Admin' && (
                    <TableCell className="text-zinc-300">{customerMap[o.customerId] ?? '—'}</TableCell>
                  )}
                  <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
                  <TableCell className="text-zinc-400">{o.priority}</TableCell>
                  <TableCell className="text-zinc-300">RON {o.totalPrice.toFixed(2)}</TableCell>
                  {role === 'Admin' && (
                    <TableCell className="text-zinc-500 text-xs">{o.deliveryNotes ?? '—'}</TableCell>
                  )}
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={role === 'Admin' ? 6 : 4} className="text-center text-zinc-600 py-8">
                    No orders accessible with this role
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
npx tsc --noEmit
git add src/pages/ProtectedOrdersPage.tsx
git commit -m "feat: redesign protected orders page with proxy role selector"
```

---

## Task 15: Remove dead code + build verification

**Files:**
- Delete or empty: `src/components/PatternBanner.tsx` (replaced by PatternBadge)
- Verify: `src/components/index.ts` exports updated

- [ ] **Step 1: Remove old PatternBanner**

Check if `PatternBanner` is still imported anywhere:

```bash
grep -r "PatternBanner" src/
```

If no remaining imports, delete the file:

```bash
rm src/components/PatternBanner.tsx
```

- [ ] **Step 2: Update `src/components/index.ts` if it exists**

If the file exists, replace its exports to match new component names. If it doesn't exist, skip.

- [ ] **Step 3: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Production build**

```bash
npm run build
```

Expected: `vite build` completes with zero errors. Output in `dist/`.

- [ ] **Step 5: Commit + push**

```bash
git add -A
git commit -m "refactor: remove legacy PatternBanner, final build verification"
git push origin main
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Tailwind CSS v3 installed | Task 1 |
| shadcn/ui components | Task 4 |
| lucide-react icons | Task 1 |
| react-router-dom v6 | Task 1 + Task 6 |
| Dark Pro color tokens | Task 3 |
| Sidebar 220px + topbar | Task 6 |
| Dashboard page + 4 KPIs | Task 7 |
| Orders: stepper + clone (Prototype + Builder) | Task 8 |
| Customers: search + table | Task 9 |
| Couriers: vehicle badges (Factory + Flyweight) | Task 10 |
| Deliveries: compact stepper (Facade + Decorator) | Task 11 |
| Place Order: composite tree + facade form + adapter payment | Task 12 |
| Reports: Bridge renderer toggle | Task 13 |
| Protected Orders: Proxy role check | Task 14 |
| PatternBadge visible on all pages | Tasks 8-14 |
| No emoji (lucide icons only) | All tasks |
| Zero TypeScript errors | Task 15 |
| `npm run build` passes | Task 15 |
| Commit with realistic messages | All tasks |

All spec requirements covered.
