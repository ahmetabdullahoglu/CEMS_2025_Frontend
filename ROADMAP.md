# 🗺️ CEMS Frontend Development Roadmap

**خارطة الطريق المحسّنة - مركزة على Frontend فقط**

**النسخة:** 2.0  
**آخر تحديث:** November 12, 2025

---

## 📋 نظرة عامة

### الهدف
بناء واجهة مستخدم حديثة وسريعة لنظام إدارة الصرافة في **12-13 يوم عمل**.

### النطاق
- ✅ **مضمّن**: جميع مراحل Frontend
- ❌ **مستثنى**: إصلاحات Backend (تم إنجازها)
- ❌ **مستثنى**: مرحلة الاختبارات الشاملة (خارج MVP)
- ❌ **مستثنى**: مرحلة Production Deployment

### التقنيات
```yaml
Core: React 18 + TypeScript + Vite
UI: Tailwind CSS + shadcn/ui + Lucide Icons
State: React Query + Context API
Forms: React Hook Form + Zod
Charts: Recharts
HTTP: Axios
```

---

## 📊 الجدول الزمني

| المرحلة | المدة | الأولوية | المكونات الرئيسية |
|---------|-------|----------|-------------------|
| **Phase 1** | 1 يوم | 🔴 | Setup + Config |
| **Phase 2** | 1 يوم | 🔴 | Authentication |
| **Phase 3** | 1 يوم | 🔴 | Layout + Navigation |
| **Phase 4** | 1 يوم | 🔴 | Dashboard |
| **Phase 5** | 3 أيام | 🔴 | Transactions (قلب النظام) |
| **Phase 6** | 2 يوم | 🔴 | Customers |
| **Phase 7** | 1 يوم | 🟡 | Currencies + Branches |
| **Phase 8** | 2 يوم | 🟡 | Reports |
| **Phase 9** | 1 يوم | 🟢 | Vault (اختياري) |

**إجمالي MVP:** 12-13 يوم

---

## 📦 Phase 1: الإعداد والتهيئة

### المدة: يوم واحد

### المهام
1. إنشاء مشروع Vite + React + TypeScript
2. تثبيت جميع المكتبات المطلوبة
3. إعداد Tailwind CSS
4. إعداد shadcn/ui
5. إنشاء هيكل المجلدات
6. إعداد Axios Client مع Interceptors
7. إعداد React Router
8. ملف .env

### المخرجات
```
✅ Project structure complete
✅ All dependencies installed
✅ Tailwind working
✅ shadcn/ui initialized
✅ API client configured
✅ Dev server running
```

### الملفات الأساسية
- `vite.config.ts` - إعدادات Vite + aliases
- `tailwind.config.js` - إعدادات Tailwind
- `src/lib/api/client.ts` - Axios client
- `.env` - متغيرات البيئة

---

## 🔐 Phase 2: المصادقة (Authentication)

### المدة: يوم واحد

### المكونات

#### 2.1 أنواع TypeScript
**File:** `src/types/auth.types.ts`
```typescript
- LoginRequest
- LoginResponse
- User
- AuthState
```

#### 2.2 سياق المصادقة
**File:** `src/contexts/AuthContext.tsx`
```typescript
- AuthProvider
- useAuth hook
- Login/Logout functions
- Token management
```

#### 2.3 صفحة تسجيل الدخول
**File:** `src/features/auth/pages/LoginPage.tsx`
- نموذج تسجيل دخول
- React Hook Form + Zod validation
- معالجة الأخطاء
- Loading states

#### 2.4 المسارات المحمية
**File:** `src/features/auth/components/ProtectedRoute.tsx`
- حماية المسارات
- إعادة التوجيه للـ Login

### الـ APIs
```
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### المخرجات
```
✅ Login page functional
✅ Token storage working
✅ Protected routes working
✅ Logout working
✅ Auto token refresh
```

---

## 🎨 Phase 3: Layout والتنقل

### المدة: يوم واحد

### المكونات

#### 3.1 App Layout
**File:** `src/components/layout/AppLayout.tsx`
- Container رئيسي
- Sidebar + TopBar integration
- Outlet للصفحات

#### 3.2 Sidebar
**File:** `src/components/layout/Sidebar.tsx`
- قائمة التنقل
- قابلة للطي (collapsible)
- Role-based menu items
- Mobile responsive

#### 3.3 Top Bar
**File:** `src/components/layout/TopBar.tsx`
- اسم المستخدم
- قائمة المستخدم
- زر تسجيل الخروج
- إشعارات (اختياري)

#### 3.4 المسارات
**File:** `src/app/routes.tsx`
- تعريف جميع المسارات
- Lazy loading للصفحات

### الميزات
- Navigation responsive
- Mobile drawer
- Active menu highlighting
- Role-based visibility

### المخرجات
```
✅ Layout renders correctly
✅ Navigation works
✅ Sidebar collapsible
✅ Mobile responsive
✅ Role-based menus
```

---

## 📊 Phase 4: لوحة المعلومات (Dashboard)

### المدة: يوم واحد

### المكونات

#### 4.1 صفحة Dashboard
**File:** `src/features/dashboard/pages/DashboardPage.tsx`
- Layout للبطاقات والرسوم
- Grid responsive

#### 4.2 بطاقات الإحصائيات
**File:** `src/features/dashboard/components/StatCard.tsx`
- إجمالي الإيرادات
- عدد المعاملات
- عدد العملاء
- عدد الفروع

#### 4.3 رسم الإيرادات
**File:** `src/features/dashboard/components/RevenueChart.tsx`
- Recharts
- Weekly/Monthly view
- Responsive

#### 4.4 المعاملات الأخيرة
**File:** `src/features/dashboard/components/RecentTransactions.tsx`
- جدول آخر 10 معاملات
- Quick actions

### الـ APIs
```
GET /api/v1/dashboard/overview
GET /api/v1/dashboard/charts?period=weekly
```

### المخرجات
```
✅ Stat cards display data
✅ Charts render correctly
✅ Recent transactions table
✅ Responsive layout
✅ Loading states
```

---

## 💰 Phase 5: إدارة المعاملات (Transactions)

### المدة: 3 أيام (الأهم)

### القسم 5.1: قائمة المعاملات (يوم واحد)

#### المكونات

**File:** `src/features/transactions/pages/TransactionsPage.tsx`
- Layout الصفحة
- Filters + Table
- Action buttons

**File:** `src/features/transactions/components/TransactionFilters.tsx`
- فلتر حسب النوع
- فلتر حسب الحالة
- فلتر حسب التاريخ
- فلتر حسب الفرع
- زر Reset

**File:** `src/features/transactions/components/TransactionTable.tsx`
- جدول المعاملات
- Pagination
- Sorting
- Row actions (View, Cancel)

#### APIs
```
GET /api/v1/transactions?skip=0&limit=50&type=&status=&date_from=&date_to=&branch_id=
```

#### المخرجات
```
✅ Transaction list displays
✅ Filters work
✅ Pagination works
✅ Sorting works
```

---

### القسم 5.2: نماذج المعاملات (1.5 يوم)

#### المكونات

**File:** `src/features/transactions/components/ExchangeDialog.tsx`
- نموذج صرف العملات
- حساب المبلغ الفوري
- اختيار عملة From/To
- اختيار العميل (اختياري)
- React Hook Form + Zod

**File:** `src/features/transactions/components/IncomeDialog.tsx`
- نموذج الدخل
- اختيار العملة
- المبلغ والوصف

**File:** `src/features/transactions/components/ExpenseDialog.tsx`
- نموذج المصروف
- اختيار العملة
- المبلغ والوصف

**File:** `src/features/transactions/components/TransferDialog.tsx`
- نموذج التحويل بين الفروع
- اختيار الفرع المرسل والمستقبل
- اختيار العملة والمبلغ

**File:** `src/lib/validations/transaction.schemas.ts`
- Zod schemas لجميع النماذج

#### APIs
```
POST /api/v1/transactions/exchange
POST /api/v1/transactions/income
POST /api/v1/transactions/expense
POST /api/v1/transactions/transfer
```

#### المخرجات
```
✅ Exchange form works
✅ Real-time calculation
✅ Income/Expense forms work
✅ Transfer form works
✅ Form validation working
✅ Error handling
```

---

### القسم 5.3: تفاصيل المعاملة (0.5 يوم)

#### المكونات

**File:** `src/features/transactions/components/TransactionDetailsDialog.tsx`
- عرض جميع تفاصيل المعاملة
- Audit trail
- زر إلغاء (للـ pending)

#### APIs
```
GET /api/v1/transactions/{id}
PUT /api/v1/transactions/{id}/cancel
```

#### المخرجات
```
✅ Details display correctly
✅ Cancel transaction works
✅ Audit trail visible
```

---

## 👥 Phase 6: إدارة العملاء (Customers)

### المدة: 2 يوم

### المكونات

#### 6.1 قائمة العملاء (1 يوم)

**File:** `src/features/customers/pages/CustomersPage.tsx`
- Layout الصفحة
- Search + Filters
- Table + Actions

**File:** `src/features/customers/components/CustomerTable.tsx`
- جدول العملاء
- Pagination
- Actions (View, Edit)

**File:** `src/features/customers/components/CustomerDialog.tsx`
- نموذج إضافة/تعديل عميل
- KYC fields
- Document types
- React Hook Form + Zod

#### 6.2 صفحة تفاصيل العميل (1 يوم)

**File:** `src/features/customers/pages/CustomerDetailsPage.tsx`
- معلومات العميل
- معاملات العميل
- المستندات

**File:** `src/features/customers/components/DocumentUpload.tsx`
- رفع المستندات
- عرض المستندات المرفوعة

#### APIs
```
GET    /api/v1/customers?search=&skip=0&limit=50
POST   /api/v1/customers
GET    /api/v1/customers/{id}
PUT    /api/v1/customers/{id}
GET    /api/v1/customers/{id}/transactions
POST   /api/v1/customers/{id}/documents
GET    /api/v1/customers/{id}/documents
```

#### المخرجات
```
✅ Customer list/search works
✅ Register new customer
✅ Customer profile page
✅ Customer transactions display
✅ Document upload works
```

---

## 💱 Phase 7: العملات والفروع

### المدة: يوم واحد

### القسم 7.1: العملات (نصف يوم)

#### المكونات

**File:** `src/features/currencies/pages/CurrenciesPage.tsx`
- قائمة العملات
- Current rates
- Update rate dialog

**File:** `src/features/currencies/components/CurrencyDialog.tsx`
- تحديث سعر الصرف
- Buy/Sell rates

#### APIs
```
GET /api/v1/currencies
GET /api/v1/currencies/{id}
PUT /api/v1/currencies/{id}
```

---

### القسم 7.2: الفروع (نصف يوم)

#### المكونات

**File:** `src/features/branches/pages/BranchesPage.tsx`
- قائمة الفروع
- Branch info
- Balances overview

**File:** `src/features/branches/pages/BranchDetailsPage.tsx`
- تفاصيل الفرع
- أرصدة العملات
- المعاملات
- الموظفين

#### APIs
```
GET /api/v1/branches
GET /api/v1/branches/{id}
GET /api/v1/branches/{id}/balances
GET /api/v1/branches/{id}/transactions
```

#### المخرجات
```
✅ Currency list displays
✅ Update exchange rates
✅ Branch list displays
✅ Branch balances visible
```

---

## 📈 Phase 8: التقارير (Reports)

### المدة: 2 يوم

### المكونات

#### 8.1 صفحة التقارير (يوم واحد)

**File:** `src/features/reports/pages/ReportsPage.tsx`
- تبويبات للتقارير المختلفة
- Filters مشتركة

**File:** `src/features/reports/components/ReportFilters.tsx`
- فلتر التاريخ
- فلتر الفرع
- فلتر العملة

#### 8.2 تقرير الملخص اليومي (نصف يوم)

**File:** `src/features/reports/components/DailySummary.tsx`
- إجمالي المعاملات
- الإيرادات
- المصروفات
- الربح الصافي

#### 8.3 تقرير الإيرادات الشهري (نصف يوم)

**File:** `src/features/reports/components/MonthlyRevenue.tsx`
- إيرادات كل يوم
- رسم بياني
- مقارنة بالشهر السابق

#### 8.4 تقرير أداء الفروع

**File:** `src/features/reports/components/BranchPerformance.tsx`
- مقارنة الفروع
- Top performers
- Charts

#### APIs
```
GET /api/v1/reports/daily-summary?date=YYYY-MM-DD
GET /api/v1/reports/monthly-revenue?month=YYYY-MM
GET /api/v1/reports/branch-performance?branch_id=&period=
```

#### المخرجات
```
✅ Daily summary report
✅ Monthly revenue report
✅ Branch performance report
✅ Export to PDF/Excel (optional)
```

---

## 🏦 Phase 9: إدارة الخزنة (Vault) - اختياري

### المدة: يوم واحد

### المكونات

**File:** `src/features/vault/pages/VaultPage.tsx`
- أرصدة الخزينة
- Transfers pending
- History

**File:** `src/features/vault/components/VaultBalances.tsx`
- عرض الأرصدة لكل عملة

**File:** `src/features/vault/components/TransferDialog.tsx`
- نموذج التحويل
- Vault to Branch
- Branch to Vault

#### APIs
```
GET  /api/v1/vault/balances
POST /api/v1/vault/transfers
GET  /api/v1/vault/transfers?status=pending
PUT  /api/v1/vault/transfers/{id}/approve
PUT  /api/v1/vault/transfers/{id}/complete
```

#### المخرجات
```
✅ Vault balances display
✅ Create transfer
✅ Approve transfer
✅ Complete transfer
```

---

## 🎯 أولويات التنفيذ

### 🔴 حرج (يجب إنجازها)
```
Phase 1: Setup ✅
Phase 2: Authentication ✅
Phase 3: Layout ✅
Phase 4: Dashboard ✅
Phase 5: Transactions ✅ (الأهم)
Phase 6: Customers ✅
```

### 🟡 مهم (للـ MVP)
```
Phase 7: Currencies + Branches
Phase 8: Reports
```

### 🟢 اختياري (بعد MVP)
```
Phase 9: Vault Management
Advanced Features
Testing
```

---

## 📦 ملخص المكونات لكل مرحلة

### Phase 1: Setup
- Project Structure
- Config Files
- API Client
- Dependencies

### Phase 2: Authentication
- LoginPage
- AuthContext
- ProtectedRoute
- auth.types.ts

### Phase 3: Layout
- AppLayout
- Sidebar
- TopBar
- routes.tsx

### Phase 4: Dashboard
- DashboardPage
- StatCard
- RevenueChart
- RecentTransactions

### Phase 5: Transactions
- TransactionsPage
- TransactionFilters
- TransactionTable
- ExchangeDialog
- IncomeDialog
- ExpenseDialog
- TransferDialog
- TransactionDetailsDialog

### Phase 6: Customers
- CustomersPage
- CustomerDetailsPage
- CustomerTable
- CustomerDialog
- DocumentUpload

### Phase 7: Currencies + Branches
- CurrenciesPage
- CurrencyDialog
- BranchesPage
- BranchDetailsPage

### Phase 8: Reports
- ReportsPage
- ReportFilters
- DailySummary
- MonthlyRevenue
- BranchPerformance

### Phase 9: Vault
- VaultPage
- VaultBalances
- TransferDialog

---

## ✅ معايير إتمام كل مرحلة

### معايير عامة
- [ ] الكود يعمل بدون أخطاء
- [ ] TypeScript بدون errors
- [ ] Responsive على جميع الأجهزة
- [ ] Loading states موجودة
- [ ] Error handling موجودة
- [ ] Forms validated بـ Zod

### معايير MVP مكتمل
- [ ] جميع المراحل الحرجة (🔴) مكتملة
- [ ] يمكن تسجيل الدخول
- [ ] يمكن إنشاء معاملات
- [ ] يمكن تسجيل عملاء
- [ ] Dashboard يعرض بيانات حقيقية
- [ ] التطبيق responsive
- [ ] جاهز للاستخدام

---

## 🚀 البدء

### الخطوة الأولى
```bash
# ابدأ بـ Phase 1
npm create vite@latest cems-frontend -- --template react-ts
```

### استخدم CONTEXT.md
- اقرأ CONTEXT.md قبل كل مرحلة
- انسخ السياق في كل محادثة مع Claude
- حدّث التقدم بعد كل مرحلة

---

**🎯 هدف واضح: MVP في 12-13 يوم عمل**

**آخر تحديث:** November 12, 2025  
**الحالة:** جاهز للبدء ✅
