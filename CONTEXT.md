# 🎯 CEMS Frontend - Development Context

**استخدم هذا الملف في كل محادثة جديدة مع Claude**

**آخر تحديث:** November 12, 2025  
**النسخة:** 2.0 - المحسّنة

---

## 📋 السياق السريع (انسخ هذا في بداية كل محادثة)

```yaml
Project: CEMS Frontend - Currency Exchange Management System
Type: React 18 + TypeScript + Vite SPA
Backend: http://localhost:8000/api/v1 (Ready ✅)
Stack: React + TypeScript + Tailwind + shadcn/ui + React Query
Goal: واجهة مستخدم حديثة لإدارة الصرافة متعددة الفروع

Current Phase: [يُحدّث بعد كل مرحلة]
Completed: [ما تم إنجازه]
Status: ⏳ In Progress | ✅ Done
```

---

## 🎯 نظرة عامة على المشروع

### الهدف
بناء واجهة مستخدم حديثة وسريعة لنظام إدارة الصرافة تدعم:
- 3 أدوار مستخدمين (Admin, Manager, Teller)
- عمليات صرف متعددة (Exchange, Income, Expense, Transfer)
- إدارة عملاء وفروع
- تقارير وإحصائيات

### التقنيات
- **Core**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **State**: React Query, Context API
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts
- **HTTP**: Axios

---

## 📦 المراحل الرئيسية

### نظرة سريعة

| المرحلة | المدة | الأولوية | الوصف |
|--------|-------|----------|-------|
| **Phase 1** | 1 يوم | 🔴 | الإعداد والتهيئة |
| **Phase 2** | 1 يوم | 🔴 | المصادقة والأمان |
| **Phase 3** | 1 يوم | 🔴 | Layout والتنقل |
| **Phase 4** | 1 يوم | 🔴 | لوحة المعلومات |
| **Phase 5** | 3 أيام | 🔴 | إدارة المعاملات |
| **Phase 6** | 2 يوم | 🔴 | إدارة العملاء |
| **Phase 7** | 1 يوم | 🟡 | العملات والفروع |
| **Phase 8** | 2 يوم | 🟡 | التقارير |
| **Phase 9** | 1 يوم | 🟢 | إدارة الخزنة |

**إجمالي**: 12-13 يوم للـ MVP

---

## 📂 هيكل المشروع

```
cems-frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx              # المكون الرئيسي
│   │   └── routes.tsx           # تعريف المسارات
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── common/              # مكونات مشتركة
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorAlert.tsx
│   │   └── layout/              # Layout components
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── TopBar.tsx
│   │
│   ├── features/                # مجمّعة حسب الميزة
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   └── components/
│   │   │       └── ProtectedRoute.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   └── components/
│   │   │       ├── StatCard.tsx
│   │   │       ├── RevenueChart.tsx
│   │   │       └── TransactionsList.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── pages/
│   │   │   │   └── TransactionsPage.tsx
│   │   │   └── components/
│   │   │       ├── TransactionFilters.tsx
│   │   │       ├── TransactionTable.tsx
│   │   │       ├── ExchangeDialog.tsx
│   │   │       ├── IncomeDialog.tsx
│   │   │       ├── ExpenseDialog.tsx
│   │   │       └── TransferDialog.tsx
│   │   │
│   │   ├── customers/
│   │   │   ├── pages/
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   └── CustomerDetailsPage.tsx
│   │   │   └── components/
│   │   │       ├── CustomerTable.tsx
│   │   │       └── CustomerDialog.tsx
│   │   │
│   │   ├── currencies/
│   │   │   └── pages/
│   │   │       └── CurrenciesPage.tsx
│   │   │
│   │   ├── branches/
│   │   │   └── pages/
│   │   │       └── BranchesPage.tsx
│   │   │
│   │   ├── vault/
│   │   │   └── pages/
│   │   │       └── VaultPage.tsx
│   │   │
│   │   └── reports/
│   │       └── pages/
│   │           └── ReportsPage.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx      # سياق المصادقة
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   └── useCustomers.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts        # Axios client + interceptors
│   │   ├── utils/
│   │   │   ├── format.ts        # تنسيق التواريخ والأرقام
│   │   │   └── helpers.ts
│   │   └── validations/
│   │       ├── auth.schemas.ts
│   │       ├── transaction.schemas.ts
│   │       └── customer.schemas.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── transaction.types.ts
│   │   └── customer.types.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
└── CONTEXT.md                   # هذا الملف
```

---

## 🚀 Phase 1: الإعداد والتهيئة

**المدة:** يوم واحد  
**الأولوية:** 🔴 حرج

### المهام

#### 1.1 إنشاء المشروع وتثبيت المكتبات
```bash
# إنشاء المشروع
npm create vite@latest cems-frontend -- --template react-ts
cd cems-frontend

# المكتبات الأساسية
npm install react-router-dom @tanstack/react-query axios
npm install @hookform/resolvers react-hook-form zod
npm install tailwindcss postcss autoprefixer
npm install date-fns lucide-react sonner recharts
npm install -D @types/node

# إعداد Tailwind
npx tailwindcss init -p

# إعداد shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog select table badge
```

#### 1.2 الملفات الأساسية للإنشاء

**vite.config.ts**
```typescript
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

**tailwind.config.js**
```javascript
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
}
```

**src/lib/api/client.ts**
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          localStorage.setItem('access_token', data.access_token);
          return apiClient(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

**.env**
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### معايير النجاح Phase 1
- [ ] المشروع يعمل: `npm run dev`
- [ ] Tailwind يعمل بشكل صحيح
- [ ] shadcn/ui مثبت
- [ ] Axios client جاهز
- [ ] TypeScript بدون أخطاء

---

## 🔐 Phase 2: المصادقة (Authentication)

**المدة:** يوم واحد  
**الأولوية:** 🔴 حرج

### الملفات للإنشاء

```
src/types/auth.types.ts
src/contexts/AuthContext.tsx
src/features/auth/pages/LoginPage.tsx
src/features/auth/components/ProtectedRoute.tsx
src/lib/validations/auth.schemas.ts
```

### الـ APIs المستخدمة
```
POST   /api/v1/auth/login           # تسجيل الدخول
POST   /api/v1/auth/refresh         # تحديث Token
GET    /api/v1/auth/me              # بيانات المستخدم الحالي
POST   /api/v1/auth/logout          # تسجيل الخروج
```

### معايير النجاح Phase 2
- [ ] يمكن تسجيل الدخول بـ admin@cems.local
- [ ] Token محفوظ في localStorage
- [ ] Protected routes تعمل
- [ ] تسجيل الخروج يعمل
- [ ] Auto-refresh للـ token يعمل

---

## 🎨 Phase 3: Layout والتنقل

**المدة:** يوم واحد  
**الأولوية:** 🔴 حرج

### الملفات للإنشاء

```
src/components/layout/AppLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/app/routes.tsx
```

### الميزات
- Sidebar قابل للطي (collapsible)
- Top bar مع قائمة المستخدم
- Navigation مبني على الدور (role-based)
- Responsive للموبايل (drawer)

### معايير النجاح Phase 3
- [ ] Layout يظهر بشكل صحيح
- [ ] Navigation يعمل بين الصفحات
- [ ] Responsive على Mobile/Tablet/Desktop
- [ ] Menu items مفلترة حسب الدور

---

## 📊 Phase 4: لوحة المعلومات (Dashboard)

**المدة:** يوم واحد  
**الأولوية:** 🔴 حرج

### الملفات للإنشاء

```
src/features/dashboard/pages/DashboardPage.tsx
src/features/dashboard/components/StatCard.tsx
src/features/dashboard/components/RevenueChart.tsx
src/features/dashboard/components/RecentTransactions.tsx
```

### الـ APIs المستخدمة
```
GET /api/v1/dashboard/overview
GET /api/v1/dashboard/charts?period=weekly
```

### المكونات
1. **Stat Cards** - إجمالي الإيرادات، المعاملات، العملاء، الفروع
2. **Revenue Chart** - رسم بياني للإيرادات
3. **Recent Transactions** - آخر المعاملات

### معايير النجاح Phase 4
- [ ] Stat cards تعرض البيانات
- [ ] Charts تعرض بشكل صحيح
- [ ] جدول المعاملات الأخيرة يعمل
- [ ] Responsive design

---

## 💰 Phase 5: إدارة المعاملات (Transactions)

**المدة:** 3 أيام  
**الأولوية:** 🔴 حرج جداً

### الأقسام الفرعية

#### 5.1 قائمة المعاملات (1 يوم)
```
src/features/transactions/pages/TransactionsPage.tsx
src/features/transactions/components/TransactionFilters.tsx
src/features/transactions/components/TransactionTable.tsx
```

**APIs:**
```
GET /api/v1/transactions?skip=0&limit=50&type=&status=&date_from=&date_to=
```

#### 5.2 نماذج المعاملات (1.5 يوم)
```
src/features/transactions/components/ExchangeDialog.tsx
src/features/transactions/components/IncomeDialog.tsx
src/features/transactions/components/ExpenseDialog.tsx
src/features/transactions/components/TransferDialog.tsx
src/lib/validations/transaction.schemas.ts
```

**APIs:**
```
POST /api/v1/transactions/exchange
POST /api/v1/transactions/income
POST /api/v1/transactions/expense
POST /api/v1/transactions/transfer
```

#### 5.3 تفاصيل المعاملة (0.5 يوم)
```
src/features/transactions/components/TransactionDetailsDialog.tsx
```

**APIs:**
```
GET    /api/v1/transactions/{id}
PUT    /api/v1/transactions/{id}/cancel
```

### معايير النجاح Phase 5
- [ ] قائمة المعاملات مع فلاتر تعمل
- [ ] إنشاء معاملة صرف (Exchange)
- [ ] حساب سعر الصرف الفوري يعمل
- [ ] إنشاء Income/Expense
- [ ] إنشاء Transfer بين الفروع
- [ ] عرض تفاصيل المعاملة
- [ ] إلغاء المعاملات Pending

---

## 👥 Phase 6: إدارة العملاء (Customers)

**المدة:** 2 يوم  
**الأولوية:** 🔴 حرج

### الملفات للإنشاء

```
src/features/customers/pages/CustomersPage.tsx
src/features/customers/pages/CustomerDetailsPage.tsx
src/features/customers/components/CustomerTable.tsx
src/features/customers/components/CustomerDialog.tsx
src/features/customers/components/DocumentUpload.tsx
src/lib/validations/customer.schemas.ts
```

### الـ APIs المستخدمة
```
GET    /api/v1/customers?search=&skip=0&limit=50
POST   /api/v1/customers
GET    /api/v1/customers/{id}
PUT    /api/v1/customers/{id}
GET    /api/v1/customers/{id}/transactions
POST   /api/v1/customers/{id}/documents
```

### الميزات
1. **قائمة العملاء** - مع بحث وفلاتر
2. **تسجيل عميل جديد** - النموذج الكامل
3. **صفحة تفاصيل العميل** - معلومات + معاملات
4. **رفع المستندات** - هوية، جواز، وثائق

### معايير النجاح Phase 6
- [ ] قائمة/بحث العملاء يعمل
- [ ] تسجيل عميل جديد
- [ ] عرض ملف العميل
- [ ] عرض معاملات العميل
- [ ] رفع المستندات

---

## 💱 Phase 7: العملات والفروع

**المدة:** يوم واحد  
**الأولوية:** 🟡 مهم

### الملفات للإنشاء

```
src/features/currencies/pages/CurrenciesPage.tsx
src/features/currencies/components/CurrencyDialog.tsx
src/features/branches/pages/BranchesPage.tsx
src/features/branches/pages/BranchDetailsPage.tsx
```

### الـ APIs المستخدمة
```
GET    /api/v1/currencies
PUT    /api/v1/currencies/{id}
GET    /api/v1/branches
GET    /api/v1/branches/{id}
GET    /api/v1/branches/{id}/balances
```

### معايير النجاح Phase 7
- [ ] قائمة العملات
- [ ] تحديث أسعار الصرف
- [ ] قائمة الفروع
- [ ] عرض أرصدة الفروع

---

## 📈 Phase 8: التقارير (Reports)

**المدة:** 2 يوم  
**الأولوية:** 🟡 مهم

### الملفات للإنشاء

```
src/features/reports/pages/ReportsPage.tsx
src/features/reports/components/ReportFilters.tsx
src/features/reports/components/DailySummary.tsx
src/features/reports/components/MonthlyRevenue.tsx
src/features/reports/components/BranchPerformance.tsx
```

### الـ APIs المستخدمة
```
GET /api/v1/reports/daily-summary?date=YYYY-MM-DD
GET /api/v1/reports/monthly-revenue?month=YYYY-MM
GET /api/v1/reports/branch-performance?branch_id=&period=
```

### معايير النجاح Phase 8
- [ ] تقرير ملخص يومي
- [ ] تقرير إيرادات شهري
- [ ] تقرير أداء الفروع
- [ ] تصدير PDF/Excel

---

## 🏦 Phase 9: إدارة الخزنة (Vault) - اختياري

**المدة:** يوم واحد  
**الأولوية:** 🟢 جيد أن يكون

### الملفات للإنشاء

```
src/features/vault/pages/VaultPage.tsx
src/features/vault/components/VaultBalances.tsx
src/features/vault/components/TransferDialog.tsx
```

### الـ APIs المستخدمة
```
GET  /api/v1/vault/balances
POST /api/v1/vault/transfers
GET  /api/v1/vault/transfers?status=pending
```

---

## 💬 قوالب المحادثة مع Claude

### قالب 1: بدء مرحلة جديدة

```markdown
## CONTEXT
Project: CEMS Frontend
Phase: [رقم واسم المرحلة]
Previous: [ما تم إنجازه سابقاً]
Backend API: http://localhost:8000/api/v1

## TASK
[المهمة المحددة لهذه المحادثة]

## FILES TO CREATE
[قائمة الملفات المطلوبة]

## APIs TO INTEGRATE
[Endpoints المطلوبة من openapi.json]

## REQUIREMENTS
[المتطلبات والميزات]

## OUTPUT
- أكواد كاملة في artifacts
- ملف واحد في كل مرة
- مع TypeScript types
- مع Zod validations حيث تلزم

## SUCCESS CRITERIA
[معايير النجاح الواضحة]
```

### قالب 2: إصلاح مشكلة

```markdown
## CONTEXT
Project: CEMS Frontend
Issue: [وصف المشكلة]
Affected File: [الملف المتأثر]

## PROBLEM
[تفاصيل المشكلة]

## EXPECTED BEHAVIOR
[السلوك المتوقع]

## OUTPUT
الملف المحدّث في artifact
```

### قالب 3: إضافة ميزة

```markdown
## CONTEXT
Project: CEMS Frontend
Current Page: [اسم الصفحة]
New Feature: [الميزة الجديدة]

## REQUIREMENTS
[متطلبات الميزة]

## APIs
[إن وجدت]

## OUTPUT
المكونات الجديدة/المحدّثة في artifacts
```

---

## 📊 تتبع التقدم

### الأسبوع 1: الأساسيات
```
□ Phase 1: Setup (Day 1)
□ Phase 2: Auth (Day 2)
□ Phase 3: Layout (Day 3)
□ Phase 4: Dashboard (Day 4)
```

### الأسبوع 2: الميزات الأساسية
```
□ Phase 5.1: Transaction List (Day 1)
□ Phase 5.2: Transaction Forms (Day 2-3)
□ Phase 5.3: Transaction Details (Day 4)
□ Phase 6: Customers Start (Day 5)
```

### الأسبوع 3: إكمال MVP
```
□ Phase 6: Customers Complete (Day 1)
□ Phase 7: Currencies & Branches (Day 2)
□ Phase 8: Reports (Day 3-4)
□ Phase 9: Vault (Optional) (Day 5)
```

---

## 🎯 نصائح مهمة

### عند بدء محادثة جديدة
1. انسخ السياق من هذا الملف
2. حدد المرحلة الحالية
3. اذكر ما تم إنجازه سابقاً
4. كن محدداً في المهمة الحالية
5. اطلب artifacts

### أثناء التطوير
1. اختبر كل مكون فوراً
2. Commit بعد كل مرحلة
3. حدّث هذا الملف بالتقدم
4. اجعل المكونات صغيرة ومركزة
5. استخدم TypeScript بشكل صارم

### جودة الكود
1. أنواع TypeScript في كل مكان
2. Validation بـ Zod للنماذج
3. معالجة حالات Loading/Error
4. Responsive بشكل افتراضي
5. Interfaces واضحة

---

## 🔗 روابط سريعة

### التوثيق
- Backend API: http://localhost:8000/docs
- React: https://react.dev
- TypeScript: https://typescriptlang.org
- Tailwind: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- React Query: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

### Backend Endpoints
```
Auth:         /api/v1/auth/*
Users:        /api/v1/users/*
Currencies:   /api/v1/currencies/*
Branches:     /api/v1/branches/*
Customers:    /api/v1/customers/*
Transactions: /api/v1/transactions/*
Vault:        /api/v1/vault/*
Reports:      /api/v1/reports/*
Dashboard:    /api/v1/dashboard/*
```

---

## ✅ معايير إتمام MVP

### المتطلبات الوظيفية
- ✅ تسجيل الدخول/الخروج يعمل
- ✅ إنشاء جميع أنواع المعاملات
- ✅ تسجيل وإدارة العملاء
- ✅ لوحة المعلومات تعرض بيانات حقيقية
- ✅ التقارير الأساسية تعمل
- ✅ واجهة responsive
- ✅ معالجة الأخطاء

### المتطلبات غير الوظيفية
- ✅ تحميل الصفحة < 2 ثانية
- ✅ يعمل على Chrome, Firefox, Safari, Edge
- ✅ Responsive (Mobile, Tablet, Desktop)
- ✅ آمن (HTTPS, JWT)
- ✅ Types صحيحة لـ TypeScript

---

**🚀 جاهز للبدء!**

**الخطوة التالية:** ابدأ Phase 1 - الإعداد والتهيئة

**آخر تحديث:** [حدّث بعد كل مرحلة]  
**المرحلة الحالية:** [حدّث بعد كل مرحلة]  
**تقدم MVP:** [X/9 مراحل مكتملة]
