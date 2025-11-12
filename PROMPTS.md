# 💬 CEMS Frontend - Prompts للمحادثات

**قائمة Prompts لكل مرحلة - جاهزة للنسخ واللصق في محادثات منفصلة**

---

## 📋 ملاحظات مهمة

### قبل البدء
1. **كل prompt في محادثة منفصلة**
2. **اقرأ CONTEXT.md أولاً** للحصول على التفاصيل
3. **استخدم openapi.json** كمرجع للـ APIs
4. **اطلب artifacts** لكل ملف

### بعد كل محادثة
1. انسخ الكود من artifacts
2. اختبر المكون فوراً
3. حدّث CONTEXT.md بالتقدم
4. Commit التغييرات

---

## 🚀 Phase 1: الإعداد والتهيئة

### Prompt 1.1: إعداد المشروع الأساسي

```markdown
## CONTEXT
Project: CEMS Frontend - Currency Exchange Management System
Task: Phase 1 - Initial Project Setup
Backend API: http://localhost:8000/api/v1 (Ready ✅)
Tech Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui

## TASK
Setup complete React + TypeScript project with Vite, configure all necessary tools and create project structure.

## REQUIREMENTS

1. Create vite.config.ts with:
   - React plugin
   - Path aliases (@/...)
   - Proper TypeScript config

2. Create tailwind.config.js with:
   - shadcn/ui compatible settings
   - Custom colors for CEMS brand
   - Dark mode support

3. Create tsconfig.json with:
   - Strict mode
   - Path mapping for @/...
   - Proper React settings

4. Create src/lib/api/client.ts with:
   - Axios instance with baseURL from env
   - Request interceptor for adding JWT token
   - Response interceptor for token refresh
   - Error handling

5. Create .env file with:
   - VITE_API_BASE_URL=http://localhost:8000/api/v1

6. Update package.json scripts if needed

## OUTPUT
Provide complete code for each file in separate artifacts:
1. vite.config.ts
2. tailwind.config.js
3. tsconfig.json
4. src/lib/api/client.ts
5. .env
6. Installation commands list

## SUCCESS CRITERIA
- ✅ TypeScript compiles without errors
- ✅ Tailwind CSS working
- ✅ Path aliases (@/...) working
- ✅ Axios client ready with interceptors
```

---

## 🔐 Phase 2: المصادقة

### Prompt 2.1: Types والـ API للمصادقة

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 2 - Authentication
Previous: Phase 1 completed ✅
Backend: http://localhost:8000/api/v1

## TASK
Create TypeScript types and API functions for authentication system.

## APIs TO USE (from openapi.json)
```
POST /api/v1/auth/login
  Body: { email, password }
  Response: { access_token, refresh_token, token_type, user }

POST /api/v1/auth/refresh
  Body: { refresh_token }
  Response: { access_token, token_type }

GET /api/v1/auth/me
  Response: User object

POST /api/v1/auth/logout
  Response: { message }
```

## FILES TO CREATE

1. src/types/auth.types.ts
   - LoginRequest interface
   - LoginResponse interface
   - User interface (id, email, full_name, role, branch_id, etc.)
   - AuthState interface

2. src/lib/api/auth.api.ts
   - login(credentials) function
   - logout() function
   - refreshToken(token) function
   - getCurrentUser() function

## OUTPUT
Complete code in artifacts for:
1. auth.types.ts
2. auth.api.ts

## SUCCESS CRITERIA
- ✅ All TypeScript types match API responses
- ✅ API functions use the axios client
- ✅ Proper error handling
```

---

### Prompt 2.2: AuthContext وصفحة Login

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 2 - Authentication (Part 2)
Previous: auth.types.ts and auth.api.ts created ✅
Tech: React Context API + React Hook Form + Zod

## TASK
Create authentication context and login page.

## FILES TO CREATE

1. src/contexts/AuthContext.tsx
   - AuthProvider component
   - useAuth custom hook
   - Login/Logout functions
   - Token storage in localStorage
   - User state management
   - isAuthenticated computed value

2. src/features/auth/pages/LoginPage.tsx
   - Login form with email + password
   - Use React Hook Form
   - Zod validation schema
   - Show loading state
   - Show errors
   - Redirect to dashboard after login

3. src/lib/validations/auth.schemas.ts
   - Zod schema for login form

4. src/features/auth/components/ProtectedRoute.tsx
   - Wrapper for protected routes
   - Redirect to /login if not authenticated

## REQUIREMENTS
- Use shadcn/ui Button, Input, Card components
- Responsive design
- Error messages in Arabic or English
- Loading spinner during login

## OUTPUT
Complete code in artifacts for:
1. AuthContext.tsx
2. LoginPage.tsx
3. auth.schemas.ts
4. ProtectedRoute.tsx

## SUCCESS CRITERIA
- ✅ Can login with admin@cems.local / Admin@123
- ✅ Token saved in localStorage
- ✅ Redirect to dashboard after login
- ✅ Protected routes work
```

---

## 🎨 Phase 3: Layout والتنقل

### Prompt 3.1: Sidebar و TopBar

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 3 - Layout and Navigation
Previous: Authentication working ✅
Tech: React + Tailwind + shadcn/ui + Lucide Icons

## TASK
Create application layout with sidebar and top bar.

## FILES TO CREATE

1. src/components/layout/Sidebar.tsx
   - Collapsible sidebar
   - Navigation menu items based on user role
   - Active route highlighting
   - Mobile responsive (drawer)
   - Logo and app name

Menu Items (role-based):
```
Dashboard (all roles)
Transactions (all roles)
Customers (Teller, Manager, Admin)
Currencies (Manager, Admin)
Branches (Manager, Admin)
Reports (Manager, Admin)
Vault (Admin)
Users (Admin)
```

2. src/components/layout/TopBar.tsx
   - User name and role
   - User dropdown menu
   - Logout button
   - Mobile menu toggle
   - Branch name (if applicable)

3. src/components/layout/AppLayout.tsx
   - Main container
   - Sidebar + TopBar + Content area
   - Outlet for child routes

4. src/lib/navigation.ts
   - Navigation menu configuration
   - Role-based filtering function

## REQUIREMENTS
- Use Lucide Icons
- Smooth transitions
- Responsive (mobile drawer)
- Role-based menu visibility
- Active route highlighting

## OUTPUT
Complete code in artifacts for:
1. Sidebar.tsx
2. TopBar.tsx
3. AppLayout.tsx
4. navigation.ts

## SUCCESS CRITERIA
- ✅ Layout renders correctly
- ✅ Sidebar collapsible
- ✅ Mobile drawer works
- ✅ Menu filtered by role
- ✅ Active route highlighted
```

---

### Prompt 3.2: Router Setup

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 3 - Routing (Part 2)
Previous: Layout components created ✅
Tech: React Router v6

## TASK
Setup complete routing structure with protected routes.

## FILE TO CREATE

src/app/routes.tsx
- Root route with AppLayout
- Protected routes wrapper
- All application routes
- Lazy loading for pages
- 404 page

Routes needed:
```
/ → Redirect to /dashboard
/login → LoginPage (public)
/dashboard → DashboardPage (protected)
/transactions → TransactionsPage (protected)
/customers → CustomersPage (protected)
/customers/:id → CustomerDetailsPage (protected)
/currencies → CurrenciesPage (protected)
/branches → BranchesPage (protected)
/branches/:id → BranchDetailsPage (protected)
/reports → ReportsPage (protected)
/vault → VaultPage (protected)
* → NotFoundPage
```

## REQUIREMENTS
- Use React Router v6
- Wrap protected routes with ProtectedRoute
- Use React.lazy for code splitting
- Include Suspense with loading fallback

## OUTPUT
Complete code in artifact:
- routes.tsx

## SUCCESS CRITERIA
- ✅ Routing works
- ✅ Protected routes redirect to login
- ✅ Lazy loading works
- ✅ 404 page shows
```

---

## 📊 Phase 4: لوحة المعلومات

### Prompt 4.1: Dashboard Page والمكونات

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 4 - Dashboard
Previous: Layout and routing working ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + Recharts + shadcn/ui

## TASK
Create dashboard page with statistics and charts.

## APIs TO USE
```
GET /api/v1/dashboard/overview
Response: {
  total_revenue: number
  total_transactions: number
  total_customers: number
  active_branches: number
  revenue_change_percent: number
  transactions_change_percent: number
}

GET /api/v1/dashboard/charts?period=weekly
Response: {
  revenue_data: [{date, amount}]
  transaction_types: [{type, count}]
}
```

## FILES TO CREATE

1. src/features/dashboard/pages/DashboardPage.tsx
   - Grid layout for cards and charts
   - Use React Query for data fetching
   - Loading states
   - Error states

2. src/features/dashboard/components/StatCard.tsx
   - Reusable stat card
   - Icon, title, value, change percentage
   - Color variants

3. src/features/dashboard/components/RevenueChart.tsx
   - Line chart using Recharts
   - Weekly/Monthly toggle
   - Responsive

4. src/features/dashboard/components/RecentTransactions.tsx
   - Table of last 10 transactions
   - Quick actions

5. src/hooks/useDashboard.ts
   - React Query hooks for dashboard data

6. src/types/dashboard.types.ts
   - TypeScript interfaces

## REQUIREMENTS
- Use React Query for data fetching
- Use Recharts for charts
- Responsive grid layout
- Loading skeletons
- Error handling

## OUTPUT
Complete code in artifacts for:
1. DashboardPage.tsx
2. StatCard.tsx
3. RevenueChart.tsx
4. RecentTransactions.tsx
5. useDashboard.ts
6. dashboard.types.ts

## SUCCESS CRITERIA
- ✅ Dashboard displays data
- ✅ Charts render correctly
- ✅ Loading states work
- ✅ Responsive layout
```

---

## 💰 Phase 5: إدارة المعاملات

### Prompt 5.1: قائمة المعاملات والفلاتر

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 5.1 - Transactions List
Previous: Dashboard completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + React Table + shadcn/ui

## TASK
Create transactions list page with filters and table.

## API TO USE
```
GET /api/v1/transactions?skip=0&limit=50&type=&status=&date_from=&date_to=&branch_id=
Response: {
  items: Transaction[]
  total: number
  skip: number
  limit: number
}

Transaction type: exchange | income | expense | transfer
Transaction status: pending | completed | cancelled
```

## FILES TO CREATE

1. src/features/transactions/pages/TransactionsPage.tsx
   - Page layout
   - Filters + Table + Pagination
   - "New Transaction" button

2. src/features/transactions/components/TransactionFilters.tsx
   - Filter by type (select)
   - Filter by status (select)
   - Date range picker
   - Branch filter (for admin/manager)
   - Reset button

3. src/features/transactions/components/TransactionTable.tsx
   - Columns: ID, Type, Amount, Currency, Customer, Status, Date, Actions
   - Row actions: View Details, Cancel (if pending)
   - Sorting
   - Pagination controls

4. src/hooks/useTransactions.ts
   - React Query hook
   - Filter state management

5. src/types/transaction.types.ts
   - Transaction interfaces
   - Filter interfaces

## REQUIREMENTS
- Use shadcn/ui Table, Select, Button
- Use date-fns for date formatting
- Pagination (50 per page)
- Status badges with colors
- Loading state
- Empty state

## OUTPUT
Complete code in artifacts for:
1. TransactionsPage.tsx
2. TransactionFilters.tsx
3. TransactionTable.tsx
4. useTransactions.ts
5. transaction.types.ts

## SUCCESS CRITERIA
- ✅ Transaction list displays
- ✅ Filters work
- ✅ Pagination works
- ✅ Status badges show correct colors
- ✅ Responsive
```

---

### Prompt 5.2: نموذج معاملة الصرف (Exchange)

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 5.2 - Exchange Transaction Form
Previous: Transaction list working ✅
Backend API: http://localhost:8000/api/v1
Tech: React Hook Form + Zod + shadcn/ui Dialog

## TASK
Create exchange transaction form with real-time calculation.

## API TO USE
```
POST /api/v1/transactions/exchange
Body: {
  from_currency_id: uuid
  to_currency_id: uuid
  from_amount: number
  customer_id?: uuid (optional)
  notes?: string
}
Response: Transaction object

GET /api/v1/currencies (to get exchange rates)
GET /api/v1/customers?search= (for customer search)
```

## FILE TO CREATE

src/features/transactions/components/ExchangeDialog.tsx

Features:
- Dialog with form
- From Currency select (with current rate)
- To Currency select (with current rate)
- From Amount input
- To Amount (auto-calculated, read-only)
- Customer search/select (optional)
- Notes textarea
- Submit button
- Cancel button

Real-time calculation:
- When from_amount or currencies change → calculate to_amount
- Show exchange rate being used
- Show commission (if any)

Validation (Zod):
- from_currency_id required
- to_currency_id required
- from_amount > 0 required
- from_currency ≠ to_currency

## REQUIREMENTS
- Use React Hook Form
- Use Zod validation
- Real-time calculation
- Customer autocomplete
- Loading state during submit
- Success notification (sonner)
- Error handling

## OUTPUT
Complete code in artifact:
- ExchangeDialog.tsx

Also create:
- src/lib/validations/transaction.schemas.ts (Zod schemas)

## SUCCESS CRITERIA
- ✅ Dialog opens
- ✅ Real-time calculation works
- ✅ Can submit form
- ✅ Success notification shows
- ✅ List refreshes after creation
```

---

### Prompt 5.3: نماذج Income و Expense و Transfer

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 5.3 - Income, Expense, Transfer Forms
Previous: Exchange form completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Hook Form + Zod + shadcn/ui

## TASK
Create three transaction forms: Income, Expense, and Transfer.

## APIs TO USE
```
POST /api/v1/transactions/income
Body: {
  currency_id: uuid
  amount: number
  description: string
  notes?: string
}

POST /api/v1/transactions/expense
Body: {
  currency_id: uuid
  amount: number
  description: string
  category?: string
  notes?: string
}

POST /api/v1/transactions/transfer
Body: {
  from_branch_id: uuid
  to_branch_id: uuid
  currency_id: uuid
  amount: number
  notes?: string
}

GET /api/v1/branches (for transfer)
```

## FILES TO CREATE

1. src/features/transactions/components/IncomeDialog.tsx
   - Currency select
   - Amount input
   - Description input (required)
   - Notes textarea

2. src/features/transactions/components/ExpenseDialog.tsx
   - Currency select
   - Amount input
   - Description input (required)
   - Category select (optional)
   - Notes textarea

3. src/features/transactions/components/TransferDialog.tsx
   - From Branch select
   - To Branch select
   - Currency select
   - Amount input
   - Notes textarea
   - Validation: from_branch ≠ to_branch

Update:
- src/lib/validations/transaction.schemas.ts (add new schemas)

## REQUIREMENTS
- Similar structure to ExchangeDialog
- Use React Hook Form + Zod
- Success notifications
- Error handling
- Refresh list after creation

## OUTPUT
Complete code in artifacts for:
1. IncomeDialog.tsx
2. ExpenseDialog.tsx
3. TransferDialog.tsx
4. Updated transaction.schemas.ts

## SUCCESS CRITERIA
- ✅ All three dialogs work
- ✅ Forms validated correctly
- ✅ Can create income/expense/transfer
- ✅ Success notifications
- ✅ List refreshes
```

---

### Prompt 5.4: تفاصيل المعاملة

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 5.4 - Transaction Details
Previous: All transaction forms completed ✅
Backend API: http://localhost:8000/api/v1
Tech: shadcn/ui Dialog

## TASK
Create transaction details dialog with cancel functionality.

## APIs TO USE
```
GET /api/v1/transactions/{id}
Response: Full transaction object with related data

PUT /api/v1/transactions/{id}/cancel
Response: Updated transaction
```

## FILE TO CREATE

src/features/transactions/components/TransactionDetailsDialog.tsx

Features:
- Display all transaction fields
- Different layout based on transaction type
- Show related customer (if any)
- Show branch information
- Show exchange rate (for exchange type)
- Show created_by, created_at
- Show status with badge
- Cancel button (only for pending status)
- Close button

Sections:
1. Header: Transaction Number, Type, Status
2. Amount Details: From/To amounts, currencies, rates
3. Related Info: Customer, Branch, User
4. Metadata: Created at, Updated at, Notes
5. Actions: Cancel (if pending)

## REQUIREMENTS
- Use shadcn/ui Dialog, Badge, Button
- Conditional rendering based on type
- Confirmation before cancel
- Success notification after cancel
- Responsive layout

## OUTPUT
Complete code in artifact:
- TransactionDetailsDialog.tsx

## SUCCESS CRITERIA
- ✅ Details display correctly
- ✅ Different layouts for different types
- ✅ Can cancel pending transaction
- ✅ Confirmation dialog before cancel
- ✅ List refreshes after cancel
```

---

## 👥 Phase 6: إدارة العملاء

### Prompt 6.1: قائمة العملاء ونموذج التسجيل

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 6.1 - Customers List and Registration
Previous: Transactions completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + React Hook Form + Zod

## TASK
Create customers list page and registration form.

## APIs TO USE
```
GET /api/v1/customers?search=&skip=0&limit=50
Response: { items: Customer[], total, skip, limit }

POST /api/v1/customers
Body: {
  full_name: string
  id_type: "national_id" | "passport" | "iqama"
  id_number: string
  phone: string
  email?: string
  address?: string
  city?: string
  date_of_birth?: date
  nationality?: string
}
Response: Customer object
```

## FILES TO CREATE

1. src/features/customers/pages/CustomersPage.tsx
   - Search bar
   - "Register Customer" button
   - Customer table
   - Pagination

2. src/features/customers/components/CustomerTable.tsx
   - Columns: Name, ID Type, ID Number, Phone, Email, Status, Actions
   - Actions: View Details, Edit
   - Click row to view details

3. src/features/customers/components/CustomerDialog.tsx
   - Full name (required)
   - ID type select (required)
   - ID number (required)
   - Phone (required)
   - Email (optional)
   - Address (optional)
   - City (optional)
   - Date of birth (optional)
   - Nationality (optional)
   - Submit button

4. src/hooks/useCustomers.ts
   - React Query hooks

5. src/types/customer.types.ts
   - Customer interfaces

6. src/lib/validations/customer.schemas.ts
   - Zod schemas

## REQUIREMENTS
- Search debouncing (500ms)
- Form validation
- Success notification
- Refresh list after registration
- Loading states
- Empty state

## OUTPUT
Complete code in artifacts for:
1. CustomersPage.tsx
2. CustomerTable.tsx
3. CustomerDialog.tsx
4. useCustomers.ts
5. customer.types.ts
6. customer.schemas.ts

## SUCCESS CRITERIA
- ✅ Customer list displays
- ✅ Search works
- ✅ Can register new customer
- ✅ Form validation works
- ✅ Success notification
- ✅ List refreshes
```

---

### Prompt 6.2: صفحة تفاصيل العميل

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 6.2 - Customer Details Page
Previous: Customer list and registration completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + React Router

## TASK
Create customer details page with transactions and documents.

## APIs TO USE
```
GET /api/v1/customers/{id}
Response: Full customer object

GET /api/v1/customers/{id}/transactions?skip=0&limit=20
Response: { items: Transaction[], total }

GET /api/v1/customers/{id}/documents
Response: Document[]

POST /api/v1/customers/{id}/documents
Body: FormData with file
Response: Document object
```

## FILES TO CREATE

1. src/features/customers/pages/CustomerDetailsPage.tsx
   - Tabs: Info, Transactions, Documents
   - Customer info card
   - Edit button
   - Back button

2. src/features/customers/components/CustomerInfo.tsx
   - Display all customer fields
   - Formatted data
   - Status badge

3. src/features/customers/components/CustomerTransactions.tsx
   - Table of customer transactions
   - Pagination
   - Link to transaction details

4. src/features/customers/components/CustomerDocuments.tsx
   - List of documents
   - Upload button
   - Download links
   - Document type badges

5. src/features/customers/components/DocumentUpload.tsx
   - File input
   - Document type select
   - Upload button
   - Progress indicator

## REQUIREMENTS
- Use React Router params for customer ID
- Tabbed interface (shadcn/ui Tabs)
- Loading states for each tab
- Document upload with progress
- Success notifications

## OUTPUT
Complete code in artifacts for:
1. CustomerDetailsPage.tsx
2. CustomerInfo.tsx
3. CustomerTransactions.tsx
4. CustomerDocuments.tsx
5. DocumentUpload.tsx

## SUCCESS CRITERIA
- ✅ Customer details display
- ✅ Transactions tab works
- ✅ Documents tab works
- ✅ Can upload documents
- ✅ Can download documents
```

---

## 💱 Phase 7: العملات والفروع

### Prompt 7.1: صفحة العملات

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 7.1 - Currencies Management
Previous: Customers completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + React Hook Form

## TASK
Create currencies page with exchange rate management.

## APIs TO USE
```
GET /api/v1/currencies
Response: Currency[]

GET /api/v1/currencies/{id}
Response: Currency object

PUT /api/v1/currencies/{id}
Body: { buy_rate, sell_rate }
Response: Updated currency
```

## FILES TO CREATE

1. src/features/currencies/pages/CurrenciesPage.tsx
   - Currency cards or table
   - Display: Code, Name, Buy Rate, Sell Rate, Last Updated
   - Edit rate button for each
   - Refresh button

2. src/features/currencies/components/CurrencyCard.tsx
   - Currency info display
   - Buy/Sell rates
   - Last updated time
   - Edit button

3. src/features/currencies/components/UpdateRateDialog.tsx
   - Currency name (read-only)
   - Current buy rate (read-only)
   - Current sell rate (read-only)
   - New buy rate input
   - New sell rate input
   - Submit button
   - Validation: rates > 0

4. src/hooks/useCurrencies.ts
   - React Query hooks

5. src/types/currency.types.ts
   - Currency interfaces

## REQUIREMENTS
- Real-time rate display
- Success notification on update
- Optimistic updates (React Query)
- Validation
- Loading states

## OUTPUT
Complete code in artifacts for:
1. CurrenciesPage.tsx
2. CurrencyCard.tsx
3. UpdateRateDialog.tsx
4. useCurrencies.ts
5. currency.types.ts

## SUCCESS CRITERIA
- ✅ Currency list displays
- ✅ Can update exchange rates
- ✅ Success notification
- ✅ Rates refresh
```

---

### Prompt 7.2: صفحات الفروع

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 7.2 - Branches Management
Previous: Currencies completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + React Router

## TASK
Create branches list and details pages.

## APIs TO USE
```
GET /api/v1/branches
Response: Branch[]

GET /api/v1/branches/{id}
Response: Branch object

GET /api/v1/branches/{id}/balances
Response: { currency_code, balance }[]

GET /api/v1/branches/{id}/transactions?skip=0&limit=20
Response: { items: Transaction[], total }
```

## FILES TO CREATE

1. src/features/branches/pages/BranchesPage.tsx
   - Branch cards or table
   - Display: Code, Name, City, Status, Total Balance
   - View Details button

2. src/features/branches/components/BranchCard.tsx
   - Branch info
   - Total balance (USD equivalent)
   - Status badge
   - View button

3. src/features/branches/pages/BranchDetailsPage.tsx
   - Branch info section
   - Balances by currency (table or cards)
   - Recent transactions
   - Users assigned to branch (optional)

4. src/features/branches/components/BranchBalances.tsx
   - Table: Currency, Balance, USD Equivalent
   - Total in USD

5. src/hooks/useBranches.ts
   - React Query hooks

6. src/types/branch.types.ts
   - Branch interfaces

## REQUIREMENTS
- Responsive cards/table
- Balance formatting
- Color-coded status
- Loading states
- Navigate to details page

## OUTPUT
Complete code in artifacts for:
1. BranchesPage.tsx
2. BranchCard.tsx
3. BranchDetailsPage.tsx
4. BranchBalances.tsx
5. useBranches.ts
6. branch.types.ts

## SUCCESS CRITERIA
- ✅ Branch list displays
- ✅ Can view branch details
- ✅ Balances display correctly
- ✅ Transactions display
- ✅ Responsive layout
```

---

## 📈 Phase 8: التقارير

### Prompt 8.1: صفحة التقارير الرئيسية

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 8.1 - Reports Page
Previous: Branches completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + Recharts + shadcn/ui Tabs

## TASK
Create reports page with multiple report types.

## APIs TO USE
```
GET /api/v1/reports/daily-summary?date=YYYY-MM-DD
Response: {
  date, total_transactions, total_revenue,
  revenue_by_type: {}, transactions_by_status: {}
}

GET /api/v1/reports/monthly-revenue?month=YYYY-MM
Response: {
  month, total_revenue, revenue_by_day: [],
  comparison_with_previous_month: {}
}

GET /api/v1/reports/branch-performance?branch_id=&period=weekly
Response: {
  branches: [], period, metrics: {}
}
```

## FILES TO CREATE

1. src/features/reports/pages/ReportsPage.tsx
   - Tabs: Daily, Monthly, Branch Performance
   - Common filters section
   - Export buttons (optional)

2. src/features/reports/components/ReportFilters.tsx
   - Date picker / Date range
   - Branch select (for admin/manager)
   - Period select (daily/weekly/monthly)
   - Generate Report button

3. src/features/reports/components/DailySummary.tsx
   - Date selector
   - Stats cards: Total Transactions, Revenue, Profit
   - Revenue by type (pie chart)
   - Transactions by status (bar chart)

4. src/features/reports/components/MonthlyRevenue.tsx
   - Month selector
   - Revenue trend (line chart)
   - Comparison with previous month
   - Top performing days

5. src/features/reports/components/BranchPerformance.tsx
   - Period selector
   - Branch comparison table
   - Performance charts
   - Top branches

6. src/hooks/useReports.ts
   - React Query hooks for each report

7. src/types/report.types.ts
   - Report interfaces

## REQUIREMENTS
- Tabbed interface
- Interactive charts (Recharts)
- Date/Month pickers
- Loading states
- Empty states
- Responsive

## OUTPUT
Complete code in artifacts for:
1. ReportsPage.tsx
2. ReportFilters.tsx
3. DailySummary.tsx
4. MonthlyRevenue.tsx
5. BranchPerformance.tsx
6. useReports.ts
7. report.types.ts

## SUCCESS CRITERIA
- ✅ Can generate daily report
- ✅ Can generate monthly report
- ✅ Can view branch performance
- ✅ Charts display correctly
- ✅ Filters work
```

---

## 🏦 Phase 9: إدارة الخزنة (اختياري)

### Prompt 9.1: صفحة الخزنة

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: 9 - Vault Management (Optional)
Previous: Reports completed ✅
Backend API: http://localhost:8000/api/v1
Tech: React Query + shadcn/ui

## TASK
Create vault management page with balances and transfers.

## APIs TO USE
```
GET /api/v1/vault/balances
Response: { currency_code, balance }[]

GET /api/v1/vault/transfers?status=pending
Response: { items: VaultTransfer[] }

POST /api/v1/vault/transfers
Body: {
  transfer_type: "vault_to_branch" | "branch_to_vault"
  from_vault_id: uuid (for vault_to_vault)
  to_vault_id: uuid (for vault_to_vault)
  to_branch_id: uuid (for vault_to_branch)
  currency_id: uuid
  amount: number
  notes: string
}

PUT /api/v1/vault/transfers/{id}/approve
PUT /api/v1/vault/transfers/{id}/complete
```

## FILES TO CREATE

1. src/features/vault/pages/VaultPage.tsx
   - Sections: Balances, Pending Transfers, History
   - "New Transfer" button

2. src/features/vault/components/VaultBalances.tsx
   - Table: Currency, Balance, USD Equivalent
   - Total balance

3. src/features/vault/components/TransferDialog.tsx
   - Transfer type select
   - From/To selects (conditional)
   - Currency select
   - Amount input
   - Notes
   - Submit

4. src/features/vault/components/PendingTransfers.tsx
   - Table of pending transfers
   - Actions: Approve, Reject, Complete

5. src/hooks/useVault.ts
   - React Query hooks

6. src/types/vault.types.ts
   - Vault interfaces

## REQUIREMENTS
- Workflow: Pending → Approved → In Transit → Completed
- Role-based actions
- Success notifications
- Confirmation dialogs

## OUTPUT
Complete code in artifacts for:
1. VaultPage.tsx
2. VaultBalances.tsx
3. TransferDialog.tsx
4. PendingTransfers.tsx
5. useVault.ts
6. vault.types.ts

## SUCCESS CRITERIA
- ✅ Vault balances display
- ✅ Can create transfer
- ✅ Can approve transfer
- ✅ Can complete transfer
- ✅ Workflow works correctly
```

---

## 📝 ملاحظات نهائية

### نصائح للاستخدام الفعال

1. **ابدأ بالترتيب**: Phase 1 → 2 → 3 → ... الخ
2. **محادثة واحدة لكل prompt**: لا تجمع عدة prompts
3. **اختبر فوراً**: بعد كل محادثة، اختبر الكود
4. **راجع openapi.json**: للتأكد من صحة APIs
5. **استخدم CONTEXT.md**: للتفاصيل الإضافية

### عند مواجهة مشاكل

```markdown
## CONTEXT
Project: CEMS Frontend
Issue: [وصف واضح للمشكلة]
File: [الملف المتأثر]

## PROBLEM
[شرح المشكلة بالتفصيل]

## EXPECTED BEHAVIOR
[ما المتوقع أن يحدث]

## CURRENT BEHAVIOR
[ما يحدث حالياً]

## OUTPUT
الحل المقترح أو الكود المحدّث
```

---

**🎯 الآن لديك جميع Prompts جاهزة!**

**ابدأ بـ Prompt 1.1 في محادثة جديدة**

**Good luck! 🚀**
