# 🎨 CEMS Frontend

**نظام إدارة الصرافة - واجهة المستخدم**

تطبيق ويب حديث وسريع لإدارة الصرافة متعددة الفروع مع دعم 3 أدوار: Admin, Manager, Teller

---

## 🚀 البدء السريع

```bash
# 1. إنشاء المشروع
npm create vite@latest cems-frontend -- --template react-ts
cd cems-frontend

# 2. تثبيت المكتبات الأساسية
npm install react-router-dom @tanstack/react-query axios
npm install @hookform/resolvers react-hook-form zod
npm install tailwindcss postcss autoprefixer
npm install date-fns lucide-react sonner recharts
npm install -D @types/node

# 3. إعداد Tailwind
npx tailwindcss init -p

# 4. إعداد shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog select table badge

# 5. ملف البيئة
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env

# 6. تشغيل التطبيق
npm run dev
```

**الوصول:** http://localhost:5173

---

## 📋 معلومات المشروع

| الخاصية | القيمة |
|---------|--------|
| **النوع** | Single Page Application |
| **Framework** | React 18 + TypeScript |
| **Build** | Vite |
| **التصميم** | Tailwind CSS + shadcn/ui |
| **Backend** | http://localhost:8000/api/v1 |

---

## 🛠️ التقنيات المستخدمة

```yaml
Core:
  - React 18 + TypeScript
  - Vite (Build Tool)

UI & Styling:
  - Tailwind CSS
  - shadcn/ui Components
  - Lucide Icons

State & Data:
  - React Query (Server State)
  - Context API (Auth State)

Forms & Validation:
  - React Hook Form
  - Zod Schemas

Charts:
  - Recharts

HTTP:
  - Axios + Interceptors
```

---

## 📂 هيكل المشروع

```
cems-frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui
│   │   ├── common/          # مكونات مشتركة
│   │   └── layout/          # Layout, Sidebar, TopBar
│   ├── features/            # مجمّعة حسب الميزة
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── customers/
│   │   ├── currencies/
│   │   ├── branches/
│   │   ├── vault/
│   │   └── reports/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/               # Custom Hooks
│   ├── lib/
│   │   ├── api/            # API Client
│   │   ├── utils/
│   │   └── validations/    # Zod Schemas
│   ├── types/              # TypeScript Types
│   └── styles/
│       └── globals.css
├── public/
├── .env
└── package.json
```

---

## 🎯 الميزات الأساسية (MVP)

### ✅ تم التنفيذ
- ❌ لم يبدأ بعد (المطلوب)

### 🔴 حرج (P0)
- ✅ المصادقة (Login/Logout)
- ✅ واجهة التطبيق (Layout + Navigation)
- ✅ لوحة المعلومات (Dashboard)
- ✅ إدارة المعاملات (Transactions)
- ✅ إدارة العملاء (Customers)

### 🟡 مهم (P1)
- ❌ إدارة العملات (Currencies)
- ❌ إدارة الفروع (Branches)
- ❌ التقارير الأساسية (Reports)

### 🟢 جيد أن يكون (P2)
- ❌ إدارة الخزنة (Vault)
- ❌ إدارة المستخدمين (Users)

---

## 🔐 بيانات الدخول للتجربة

```
Username: admin@cems.local
Password: Admin@123
```

---

## 🎨 الأدوار ومستويات الوصول

### 👤 Admin (مدير النظام)
- الوصول الكامل للنظام
- إدارة المستخدمين والصلاحيات
- جميع التقارير والإعدادات

### 👤 Manager (مدير الفرع)
- إدارة الفرع والموظفين
- الموافقة على المعاملات
- تقارير الفرع

### 👤 Teller (موظف الصراف)
- المعاملات اليومية
- تسجيل العملاء
- الوصول الأساسي

---

## 📝 الأوامر المتاحة

```bash
npm run dev          # خادم التطوير
npm run build        # بناء الإنتاج
npm run preview      # معاينة البناء
npm run lint         # فحص الكود
npm run type-check   # فحص TypeScript
```

---

## 🔗 روابط مهمة

### توثيق Backend
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### مكتبات Frontend
- [React](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)

---

## 🛠️ استكشاف الأخطاء

### مشكلة الاتصال بالـ Backend
```bash
# تأكد من تشغيل Backend
curl http://localhost:8000/health

# تحقق من CORS
# يجب أن يسمح Backend بـ: http://localhost:5173
```

### مشكلة Tailwind
```js
// tailwind.config.js - تحقق من content
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

### مشكلة المسارات (@/...)
```ts
// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## 📊 معايير النجاح

### بعد كل مرحلة
- ✅ الميزة تعمل كما متوقع
- ✅ لا أخطاء في Console
- ✅ responsive على جميع الأجهزة
- ✅ أنواع TypeScript صحيحة

### MVP مكتمل
- ✅ تسجيل الدخول والخروج يعمل
- ✅ إنشاء جميع أنواع المعاملات
- ✅ تسجيل العملاء
- ✅ لوحة المعلومات تعرض البيانات
- ✅ التقارير الأساسية تعمل
- ✅ تصميم responsive
- ✅ جاهز للإنتاج

---

## 🎓 نصائح التطوير

1. **استخدم CONTEXT.md** - اقرأه قبل بدء كل مرحلة
2. **اختبر فوراً** - اختبر كل مكون بعد إنشائه
3. **Commit بانتظام** - بعد كل ميزة مكتملة
4. **TypeScript Strict** - استخدم الأنواع في كل مكان
5. **Components صغيرة** - مكونات صغيرة ومركزة

---

**🚀 جاهز للبناء!**

**الخطوة التالية:** اتبع CONTEXT.md للبدء في المرحلة الأولى
