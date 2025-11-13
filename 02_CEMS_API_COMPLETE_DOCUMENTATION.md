# 📚 CEMS API - التوثيق الكامل لجميع Endpoints
## Complete API Documentation for Frontend Development

**Version:** 1.0  
**Base URL:** `http://localhost:8000/api/v1`  
**Authentication:** Bearer JWT Token  
**Date:** November 10, 2025

---

## 📑 جدول المحتويات | Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization) (7 endpoints)
2. [User Management](#2-user-management) (5 endpoints)
3. [Currency Management](#3-currency-management) (7 endpoints)
4. [Branch Management](#4-branch-management) (8 endpoints)
5. [Customer Management](#5-customer-management) (10 endpoints)
6. [Transaction Management](#6-transaction-management) (12 endpoints)
7. [Vault Management](#7-vault-management) (9 endpoints)
8. [Reports](#8-reports) (12 endpoints)
9. [Dashboard](#9-dashboard) (6 endpoints)
10. [Health & Status](#10-health--status) (2 endpoints)

**إجمالي Endpoints:** 78+

---

## 🔐 1. Authentication & Authorization

### 1.1 Login - تسجيل الدخول
```http
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "username": "admin@cems.local",
  "password": "Admin@123"
}

Response 200:
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "username": "admin@cems.local",
      "email": "admin@cems.local",
      "full_name": "System Administrator",
      "roles": ["admin"],
      "branches": []
    }
  }
}

Errors:
401: Invalid credentials
429: Too many login attempts
```

### 1.2 Register User - تسجيل مستخدم جديد
```http
POST /api/v1/auth/register
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "username": "teller1",
  "email": "teller1@cems.local",
  "password": "Secure@123",
  "full_name": "John Doe",
  "phone_number": "+966501234567",
  "role_ids": ["teller-role-uuid"],
  "branch_ids": ["branch-uuid"]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "teller1",
    "email": "teller1@cems.local",
    "full_name": "John Doe",
    "is_active": true,
    "roles": ["teller"],
    "branches": [{"id": "uuid", "name": "Main Branch"}]
  }
}
```

### 1.3 Refresh Token - تحديث التوكن
```http
POST /api/v1/auth/refresh
Content-Type: application/json

Request Body:
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response 200:
{
  "success": true,
  "data": {
    "access_token": "new_access_token...",
    "token_type": "bearer",
    "expires_in": 900
  }
}
```

### 1.4 Logout - تسجيل الخروج
```http
POST /api/v1/auth/logout
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 1.5 Get Current User - بيانات المستخدم الحالي
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@cems.local",
    "full_name": "Administrator",
    "roles": ["admin"],
    "branches": [],
    "permissions": ["*"]
  }
}
```

### 1.6 Change Password - تغيير كلمة المرور
```http
POST /api/v1/auth/change-password
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "current_password": "OldPassword@123",
  "new_password": "NewPassword@123",
  "confirm_password": "NewPassword@123"
}

Response 200:
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 1.7 Request Password Reset
```http
POST /api/v1/auth/request-reset
Content-Type: application/json

Request Body:
{
  "email": "user@cems.local"
}

Response 200:
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 👥 2. User Management

### 2.1 List Users - قائمة المستخدمين
```http
GET /api/v1/users?skip=0&limit=50&search=john&role=teller&is_active=true
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "total": 25,
    "items": [
      {
        "id": "uuid",
        "username": "teller1",
        "email": "teller1@cems.local",
        "full_name": "John Doe",
        "is_active": true,
        "roles": ["teller"],
        "branches": [{"id": "uuid", "name": "Main Branch"}],
        "created_at": "2025-01-01T00:00:00Z"
      }
    ],
    "skip": 0,
    "limit": 50
  }
}

Query Parameters:
- skip: int (default: 0) - للترقيم
- limit: int (default: 50, max: 100) - عدد النتائج
- search: string - البحث في الاسم أو البريد
- role: string - تصفية حسب الدور
- is_active: boolean - المستخدمين النشطين فقط
```

### 2.2 Get User - تفاصيل مستخدم
```http
GET /api/v1/users/{user_id}
Authorization: Bearer {access_token}
Permissions: admin, manager, self

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "teller1",
    "email": "teller1@cems.local",
    "full_name": "John Doe",
    "phone_number": "+966501234567",
    "is_active": true,
    "roles": [
      {
        "id": "uuid",
        "name": "teller",
        "display_name_ar": "موظف صراف"
      }
    ],
    "branches": [
      {
        "id": "uuid",
        "name": "Main Branch",
        "is_primary": true
      }
    ],
    "created_at": "2025-01-01T00:00:00Z",
    "last_login": "2025-01-10T10:30:00Z"
  }
}
```

### 2.3 Create User - إضافة مستخدم
```http
POST /api/v1/users
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "username": "manager1",
  "email": "manager1@cems.local",
  "password": "Secure@123",
  "full_name": "Jane Smith",
  "phone_number": "+966501234568",
  "role_ids": ["manager-role-uuid"],
  "branch_ids": ["branch1-uuid", "branch2-uuid"],
  "primary_branch_id": "branch1-uuid"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "username": "manager1",
    "email": "manager1@cems.local",
    "full_name": "Jane Smith",
    "roles": ["manager"],
    "branches": [...]
  }
}
```

### 2.4 Update User - تحديث مستخدم
```http
PUT /api/v1/users/{user_id}
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "full_name": "Jane Smith Updated",
  "phone_number": "+966501234569",
  "is_active": true,
  "role_ids": ["manager-role-uuid"],
  "branch_ids": ["branch1-uuid"]
}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "manager1",
    "full_name": "Jane Smith Updated",
    ...
  }
}
```

### 2.5 Delete User - حذف مستخدم
```http
DELETE /api/v1/users/{user_id}
Authorization: Bearer {access_token}
Permissions: admin

Response 200:
{
  "success": true,
  "message": "User deactivated successfully"
}

Note: Soft delete - المستخدم يصبح is_active=false
```

---

## 💰 3. Currency Management

### 3.1 List Currencies - قائمة العملات
```http
GET /api/v1/currencies?is_active=true&skip=0&limit=50
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "total": 10,
    "items": [
      {
        "id": "uuid",
        "code": "USD",
        "name": "US Dollar",
        "name_ar": "دولار أمريكي",
        "symbol": "$",
        "decimal_places": 2,
        "is_active": true,
        "current_buy_rate": 3.75,
        "current_sell_rate": 3.76,
        "last_rate_update": "2025-01-10T08:00:00Z"
      },
      {
        "id": "uuid",
        "code": "EUR",
        "name": "Euro",
        "name_ar": "يورو",
        "symbol": "€",
        "decimal_places": 2,
        "is_active": true,
        "current_buy_rate": 4.10,
        "current_sell_rate": 4.12,
        "last_rate_update": "2025-01-10T08:00:00Z"
      }
    ]
  }
}

Query Parameters:
- is_active: boolean - العملات النشطة فقط
- skip: int (default: 0)
- limit: int (default: 50)
```

### 3.2 Get Currency - تفاصيل عملة
```http
GET /api/v1/currencies/{currency_id}
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "USD",
    "name": "US Dollar",
    "name_ar": "دولار أمريكي",
    "symbol": "$",
    "decimal_places": 2,
    "is_active": true,
    "current_buy_rate": 3.75,
    "current_sell_rate": 3.76,
    "created_at": "2025-01-01T00:00:00Z",
    "rate_history": [
      {
        "buy_rate": 3.75,
        "sell_rate": 3.76,
        "effective_from": "2025-01-10T00:00:00Z"
      }
    ]
  }
}
```

### 3.3 Create Currency - إضافة عملة
```http
POST /api/v1/currencies
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "code": "GBP",
  "name": "British Pound",
  "name_ar": "جنيه إسترليني",
  "symbol": "£",
  "decimal_places": 2,
  "is_active": true,
  "initial_buy_rate": 4.50,
  "initial_sell_rate": 4.52
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "code": "GBP",
    "name": "British Pound",
    ...
  }
}
```

### 3.4 Update Currency - تحديث عملة
```http
PUT /api/v1/currencies/{currency_id}
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "name": "British Pound Sterling",
  "name_ar": "الجنيه الإسترليني",
  "is_active": true
}

Response 200:
{
  "success": true,
  "data": {...}
}
```

### 3.5 Delete Currency - حذف عملة
```http
DELETE /api/v1/currencies/{currency_id}
Authorization: Bearer {access_token}
Permissions: admin

Response 200:
{
  "success": true,
  "message": "Currency deactivated successfully"
}
```

### 3.6 Get Exchange Rates - أسعار الصرف
```http
GET /api/v1/currencies/{currency_id}/rates?from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "currency": {
      "id": "uuid",
      "code": "USD",
      "name": "US Dollar"
    },
    "rates": [
      {
        "id": "uuid",
        "buy_rate": 3.75,
        "sell_rate": 3.76,
        "effective_from": "2025-01-10T00:00:00Z",
        "updated_by": "admin",
        "updated_at": "2025-01-10T08:00:00Z"
      }
    ]
  }
}
```

### 3.7 Update Exchange Rate - تحديث سعر الصرف
```http
POST /api/v1/currencies/{currency_id}/rates
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "buy_rate": 3.76,
  "sell_rate": 3.77,
  "effective_from": "2025-01-11T00:00:00Z"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "currency_id": "uuid",
    "buy_rate": 3.76,
    "sell_rate": 3.77,
    "effective_from": "2025-01-11T00:00:00Z"
  }
}
```

---

## 🏢 4. Branch Management

### 4.1 List Branches - قائمة الفروع
```http
GET /api/v1/branches?is_active=true&skip=0&limit=50
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "total": 5,
    "items": [
      {
        "id": "uuid",
        "code": "BR001",
        "name": "Main Branch",
        "name_ar": "الفرع الرئيسي",
        "city": "Riyadh",
        "region": "Central",
        "address": "King Fahd Road",
        "phone": "+966112345678",
        "email": "main@cems.local",
        "is_active": true,
        "manager": {
          "id": "uuid",
          "full_name": "Jane Smith"
        },
        "balances": [
          {
            "currency_code": "USD",
            "balance": 50000.00,
            "alert_threshold": 10000.00
          }
        ],
        "created_at": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 4.2 Get Branch - تفاصيل فرع
```http
GET /api/v1/branches/{branch_id}
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "BR001",
    "name": "Main Branch",
    "name_ar": "الفرع الرئيسي",
    "city": "Riyadh",
    "region": "Central",
    "address": "King Fahd Road",
    "phone": "+966112345678",
    "email": "main@cems.local",
    "is_active": true,
    "manager": {...},
    "balances": [...],
    "users": [
      {
        "id": "uuid",
        "full_name": "John Doe",
        "role": "teller"
      }
    ],
    "statistics": {
      "total_transactions_today": 45,
      "total_revenue_today": 5000.00,
      "active_users": 3
    }
  }
}
```

### 4.3 Create Branch - إضافة فرع
```http
POST /api/v1/branches
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "code": "BR002",
  "name": "North Branch",
  "name_ar": "الفرع الشمالي",
  "city": "Jeddah",
  "region": "Western",
  "address": "Palestine Street",
  "phone": "+966122345678",
  "email": "north@cems.local",
  "manager_id": "manager-uuid",
  "initial_balances": [
    {
      "currency_id": "usd-uuid",
      "amount": 30000.00,
      "alert_threshold": 10000.00
    }
  ]
}

Response 201:
{
  "success": true,
  "data": {...}
}
```

### 4.4 Update Branch - تحديث فرع
```http
PUT /api/v1/branches/{branch_id}
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "name": "Main Branch - Updated",
  "phone": "+966112345679",
  "is_active": true
}

Response 200:
{
  "success": true,
  "data": {...}
}
```

### 4.5 Delete Branch - حذف فرع
```http
DELETE /api/v1/branches/{branch_id}
Authorization: Bearer {access_token}
Permissions: admin

Response 200:
{
  "success": true,
  "message": "Branch deactivated successfully"
}
```

### 4.6 Get Branch Balances - أرصدة الفرع
```http
GET /api/v1/branches/{branch_id}/balances
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "branch": {
      "id": "uuid",
      "name": "Main Branch"
    },
    "balances": [
      {
        "currency": {
          "id": "uuid",
          "code": "USD",
          "symbol": "$"
        },
        "balance": 50000.00,
        "alert_threshold": 10000.00,
        "is_low": false,
        "last_updated": "2025-01-10T14:30:00Z"
      }
    ],
    "total_value_usd": 250000.00
  }
}
```

### 4.7 Update Balance Threshold - تحديث حد التنبيه
```http
PUT /api/v1/branches/{branch_id}/thresholds
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "currency_id": "usd-uuid",
  "alert_threshold": 15000.00
}

Response 200:
{
  "success": true,
  "message": "Threshold updated successfully"
}
```

### 4.8 Assign User to Branch - تعيين موظف للفرع
```http
POST /api/v1/branches/{branch_id}/users
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "user_id": "user-uuid",
  "is_primary": true
}

Response 200:
{
  "success": true,
  "message": "User assigned to branch successfully"
}
```

---

## 👤 5. Customer Management

### 5.1 List/Search Customers - قائمة/بحث العملاء
```http
GET /api/v1/customers?search=john&skip=0&limit=50&branch_id=uuid
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "total": 150,
    "items": [
      {
        "id": "uuid",
        "customer_number": "CUS-20250110-00001",
        "first_name": "John",
        "last_name": "Doe",
        "national_id": "1234567890",
        "phone_number": "+966501234567",
        "email": "john@example.com",
        "customer_type": "individual",
        "risk_level": "low",
        "is_active": true,
        "registered_at": "2025-01-10T09:00:00Z"
      }
    ]
  }
}

Query Parameters:
- search: string - البحث في الاسم، الهاتف، الهوية
- skip: int
- limit: int
- branch_id: uuid - تصفية حسب الفرع
- customer_type: individual|corporate
- risk_level: low|medium|high
```

### 5.2 Get Customer - تفاصيل عميل
```http
GET /api/v1/customers/{customer_id}
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "customer_number": "CUS-20250110-00001",
    "first_name": "John",
    "last_name": "Doe",
    "name_ar": "جون دو",
    "national_id": "1234567890",
    "passport_number": "AB1234567",
    "phone_number": "+966501234567",
    "email": "john@example.com",
    "date_of_birth": "1990-01-15",
    "nationality": "Saudi",
    "address": "123 Main St",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "customer_type": "individual",
    "risk_level": "low",
    "is_active": true,
    "registered_at": "2025-01-10T09:00:00Z",
    "registered_by": {
      "id": "uuid",
      "full_name": "Teller Name"
    },
    "branch": {
      "id": "uuid",
      "name": "Main Branch"
    },
    "documents": [
      {
        "id": "uuid",
        "document_type": "national_id",
        "is_verified": true,
        "verified_at": "2025-01-10T09:30:00Z"
      }
    ],
    "statistics": {
      "total_transactions": 25,
      "total_volume": 125000.00,
      "last_transaction": "2025-01-09T14:20:00Z"
    }
  }
}
```

### 5.3 Create Customer - تسجيل عميل جديد
```http
POST /api/v1/customers
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager, teller

Request Body:
{
  "first_name": "Ahmed",
  "last_name": "Ali",
  "name_ar": "أحمد علي",
  "national_id": "2987654321",
  "phone_number": "+966509876543",
  "email": "ahmed@example.com",
  "date_of_birth": "1985-05-20",
  "nationality": "Saudi",
  "address": "456 King St",
  "city": "Jeddah",
  "country": "Saudi Arabia",
  "customer_type": "individual",
  "branch_id": "branch-uuid"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "customer_number": "CUS-20250110-00002",
    ...
  }
}
```

### 5.4 Update Customer - تحديث بيانات عميل
```http
PUT /api/v1/customers/{customer_id}
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager, teller

Request Body:
{
  "phone_number": "+966509876544",
  "email": "ahmed.new@example.com",
  "address": "New Address"
}

Response 200:
{
  "success": true,
  "data": {...}
}
```

### 5.5 Deactivate Customer - إلغاء تفعيل عميل
```http
DELETE /api/v1/customers/{customer_id}
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "message": "Customer deactivated successfully"
}
```

### 5.6 Get Customer Transactions - معاملات العميل
```http
GET /api/v1/customers/{customer_id}/transactions?from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "customer": {...},
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00123",
        "transaction_type": "exchange",
        "amount": 1000.00,
        "currency": "USD",
        "status": "completed",
        "transaction_date": "2025-01-10T10:30:00Z"
      }
    ],
    "summary": {
      "total_count": 25,
      "total_volume": 125000.00
    }
  }
}
```

### 5.7 Get Customer Statistics - إحصائيات العميل
```http
GET /api/v1/customers/{customer_id}/stats
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "customer_id": "uuid",
    "total_transactions": 25,
    "total_volume_usd": 125000.00,
    "last_transaction_date": "2025-01-09T14:20:00Z",
    "average_transaction_value": 5000.00,
    "most_traded_currency": "USD",
    "risk_indicators": {
      "high_value_transactions": 3,
      "recent_activity_spike": false
    }
  }
}
```

### 5.8 Upload Customer Document - رفع وثيقة
```http
POST /api/v1/customers/{customer_id}/documents
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Request Body (Form Data):
- file: [binary]
- document_type: "national_id" | "passport" | "utility_bill"
- document_number: "1234567890"
- issue_date: "2020-01-01"
- expiry_date: "2030-01-01"

Response 201:
{
  "success": true,
  "data": {
    "id": "doc-uuid",
    "document_type": "national_id",
    "document_url": "/uploads/customers/uuid/national_id.pdf",
    "is_verified": false,
    "uploaded_at": "2025-01-10T11:00:00Z"
  }
}
```

### 5.9 Get Customer Documents - قائمة الوثائق
```http
GET /api/v1/customers/{customer_id}/documents
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "customer_id": "uuid",
    "documents": [
      {
        "id": "uuid",
        "document_type": "national_id",
        "document_number": "1234567890",
        "document_url": "/uploads/...",
        "is_verified": true,
        "verified_by": "admin",
        "verified_at": "2025-01-10T11:30:00Z"
      }
    ]
  }
}
```

### 5.10 Verify Document - التحقق من وثيقة
```http
PUT /api/v1/customers/documents/{document_id}/verify
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "is_verified": true,
  "notes": "Document verified successfully"
}

Response 200:
{
  "success": true,
  "message": "Document verified successfully"
}
```

---

## 💳 6. Transaction Management

### 6.1 List All Transactions - جميع المعاملات
```http
GET /api/v1/transactions?skip=0&limit=50&from_date=2025-01-01&status=completed
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00123",
        "transaction_type": "exchange",
        "branch": {"id": "uuid", "name": "Main Branch"},
        "user": {"id": "uuid", "full_name": "John Teller"},
        "customer": {"id": "uuid", "name": "Ahmed Ali"},
        "amount": 1000.00,
        "currency": "USD",
        "status": "completed",
        "transaction_date": "2025-01-10T10:30:00Z",
        "completed_at": "2025-01-10T10:31:00Z"
      }
    ],
    "total": 1250
  }
}

Query Parameters:
- skip, limit: pagination
- from_date, to_date: تصفية التاريخ
- transaction_type: income|expense|exchange|transfer
- status: pending|completed|cancelled|failed
- branch_id: uuid
- user_id: uuid
- customer_id: uuid
- min_amount, max_amount: decimal
```

### 6.2 List Income Transactions - معاملات الدخل
```http
GET /api/v1/transactions/income?skip=0&limit=50
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00124",
        "transaction_type": "income",
        "income_category": "service_fee",
        "amount": 50.00,
        "currency": "SAR",
        "status": "completed",
        "transaction_date": "2025-01-10T11:00:00Z"
      }
    ],
    "total": 45
  }
}
```

### 6.3 List Expense Transactions - معاملات المصروفات
```http
GET /api/v1/transactions/expense?skip=0&limit=50
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00125",
        "transaction_type": "expense",
        "expense_category": "rent",
        "expense_to": "Landlord Name",
        "amount": 10000.00,
        "currency": "SAR",
        "status": "completed",
        "approved_by": "admin",
        "transaction_date": "2025-01-10T09:00:00Z"
      }
    ],
    "total": 12
  }
}
```

### 6.4 List Exchange Transactions - عمليات الصرف
```http
GET /api/v1/transactions/exchange?skip=0&limit=50
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00126",
        "transaction_type": "exchange",
        "from_currency": "USD",
        "to_currency": "SAR",
        "from_amount": 1000.00,
        "to_amount": 3750.00,
        "exchange_rate_used": 3.75,
        "commission_amount": 50.00,
        "commission_percentage": 1.33,
        "status": "completed",
        "transaction_date": "2025-01-10T12:00:00Z"
      }
    ],
    "total": 890
  }
}
```

### 6.5 List Transfer Transactions - التحويلات
```http
GET /api/v1/transactions/transfer?skip=0&limit=50
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00127",
        "transaction_type": "transfer",
        "transfer_type": "branch_to_branch",
        "from_branch": {"id": "uuid", "name": "Main Branch"},
        "to_branch": {"id": "uuid", "name": "North Branch"},
        "amount": 20000.00,
        "currency": "USD",
        "status": "completed",
        "received_by": "manager2",
        "transaction_date": "2025-01-10T08:00:00Z"
      }
    ],
    "total": 34
  }
}
```

### 6.6 Get Transaction Details - تفاصيل معاملة
```http
GET /api/v1/transactions/{transaction_id}
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_number": "TRX-20250110-00123",
    "transaction_type": "exchange",
    "branch": {...},
    "user": {...},
    "customer": {...},
    "from_currency": "USD",
    "to_currency": "SAR",
    "from_amount": 1000.00,
    "to_amount": 3750.00,
    "exchange_rate_used": 3.75,
    "commission_amount": 50.00,
    "commission_percentage": 1.33,
    "status": "completed",
    "notes": "Regular exchange",
    "transaction_date": "2025-01-10T10:30:00Z",
    "completed_at": "2025-01-10T10:31:00Z",
    "audit_trail": [
      {
        "action": "created",
        "by": "teller1",
        "at": "2025-01-10T10:30:00Z"
      },
      {
        "action": "completed",
        "by": "teller1",
        "at": "2025-01-10T10:31:00Z"
      }
    ]
  }
}
```

### 6.7 Create Income Transaction - إضافة دخل
```http
POST /api/v1/transactions/income
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "branch_id": "branch-uuid",
  "income_category": "service_fee",
  "amount": 100.00,
  "currency_id": "sar-uuid",
  "income_source": "Currency exchange service fee",
  "notes": "Morning shift collection"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "transaction_number": "TRX-20250110-00128",
    ...
  }
}
```

### 6.8 Create Expense Transaction - إضافة مصروف
```http
POST /api/v1/transactions/expense
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "branch_id": "branch-uuid",
  "expense_category": "salary",
  "amount": 5000.00,
  "currency_id": "sar-uuid",
  "expense_to": "Employee Name",
  "approval_required": true,
  "notes": "Monthly salary"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "transaction_number": "TRX-20250110-00129",
    "status": "pending",  // يحتاج موافقة
    ...
  }
}
```

### 6.9 Create Exchange Transaction - عملية صرف
```http
POST /api/v1/transactions/exchange
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "branch_id": "branch-uuid",
  "customer_id": "customer-uuid",
  "from_currency_id": "usd-uuid",
  "to_currency_id": "sar-uuid",
  "from_amount": 1000.00,
  "exchange_rate": 3.75,  // optional, يحسب تلقائياً
  "commission_percentage": 1.5,
  "notes": "Customer exchange request"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "transaction_number": "TRX-20250110-00130",
    "from_amount": 1000.00,
    "to_amount": 3735.00,  // بعد العمولة
    "exchange_rate_used": 3.75,
    "commission_amount": 15.00,
    "status": "completed",
    ...
  }
}
```

### 6.10 Create Transfer Transaction - تحويل بين الفروع
```http
POST /api/v1/transactions/transfer
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "from_branch_id": "branch1-uuid",
  "to_branch_id": "branch2-uuid",
  "currency_id": "usd-uuid",
  "amount": 10000.00,
  "transfer_type": "branch_to_branch",
  "notes": "Regular monthly transfer"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "transaction_number": "TRX-20250110-00131",
    "status": "pending",  // يحتاج استلام
    ...
  }
}
```

### 6.11 Approve Expense Transaction - الموافقة على مصروف
```http
PUT /api/v1/transactions/{transaction_id}/approve
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "notes": "Approved"
}

Response 200:
{
  "success": true,
  "message": "Transaction approved successfully"
}
```

### 6.12 Cancel Transaction - إلغاء معاملة
```http
PUT /api/v1/transactions/{transaction_id}/cancel
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "cancellation_reason": "Customer request"
}

Response 200:
{
  "success": true,
  "message": "Transaction cancelled successfully"
}

Note: لا يمكن إلغاء معاملة مكتملة إلا بصلاحيات admin
```

---

## 🏛️ 7. Vault Management

### 7.1 Get Main Vault Details - تفاصيل الخزينة الرئيسية
```http
GET /api/v1/vault
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "vault_type": "main",
    "is_active": true,
    "balances": [
      {
        "currency": {
          "code": "USD",
          "symbol": "$"
        },
        "balance": 1000000.00,
        "last_updated": "2025-01-10T15:00:00Z"
      }
    ],
    "total_value_usd": 5000000.00
  }
}
```

### 7.2 Get Vault Balances - أرصدة الخزينة
```http
GET /api/v1/vault/balances
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "balances": [
      {
        "id": "uuid",
        "currency": {
          "id": "uuid",
          "code": "USD",
          "name": "US Dollar",
          "symbol": "$"
        },
        "balance": 1000000.00,
        "last_updated": "2025-01-10T15:00:00Z"
      },
      {
        "id": "uuid",
        "currency": {
          "code": "EUR",
          "symbol": "€"
        },
        "balance": 500000.00,
        "last_updated": "2025-01-10T15:00:00Z"
      }
    ],
    "total_value_usd": 5500000.00
  }
}
```

### 7.3 Get Specific Currency Balance - رصيد عملة محددة
```http
GET /api/v1/vault/balances/{currency_id}
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "currency": {
      "id": "uuid",
      "code": "USD",
      "name": "US Dollar"
    },
    "balance": 1000000.00,
    "last_updated": "2025-01-10T15:00:00Z",
    "history": [
      {
        "date": "2025-01-10",
        "balance": 1000000.00
      },
      {
        "date": "2025-01-09",
        "balance": 950000.00
      }
    ]
  }
}
```

### 7.4 Transfer to Branch - إرسال للفرع
```http
POST /api/v1/vault/transfer/to-branch
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "to_branch_id": "branch-uuid",
  "currency_id": "usd-uuid",
  "amount": 50000.00,
  "notes": "Monthly branch replenishment"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "transfer_number": "VTR-20250110-00001",
    "transfer_type": "vault_to_branch",
    "to_branch": {
      "id": "uuid",
      "name": "Main Branch"
    },
    "currency": "USD",
    "amount": 50000.00,
    "status": "pending",  // يحتاج موافقة إذا كان المبلغ كبير
    "initiated_by": "admin",
    "initiated_at": "2025-01-10T16:00:00Z"
  }
}
```

### 7.5 Receive from Branch - استقبال من الفرع
```http
POST /api/v1/vault/transfer/from-branch
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "from_branch_id": "branch-uuid",
  "currency_id": "usd-uuid",
  "amount": 30000.00,
  "notes": "End of day deposit"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "transfer_number": "VTR-20250110-00002",
    "transfer_type": "branch_to_vault",
    "from_branch": {
      "id": "uuid",
      "name": "Main Branch"
    },
    "currency": "USD",
    "amount": 30000.00,
    "status": "pending",
    ...
  }
}
```

### 7.6 Approve Transfer - الموافقة على تحويل
```http
PUT /api/v1/vault/transfer/{transfer_id}/approve
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "notes": "Approved for transfer"
}

Response 200:
{
  "success": true,
  "message": "Transfer approved successfully",
  "data": {
    "id": "uuid",
    "transfer_number": "VTR-20250110-00001",
    "status": "in_transit",
    "approved_by": "admin",
    "approved_at": "2025-01-10T16:15:00Z"
  }
}
```

### 7.7 Complete Transfer - إتمام تحويل
```http
PUT /api/v1/vault/transfer/{transfer_id}/complete
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin, manager

Request Body:
{
  "notes": "Received successfully"
}

Response 200:
{
  "success": true,
  "message": "Transfer completed successfully",
  "data": {
    "id": "uuid",
    "transfer_number": "VTR-20250110-00001",
    "status": "completed",
    "completed_at": "2025-01-10T17:00:00Z"
  }
}
```

### 7.8 Get Transfer History - تاريخ التحويلات
```http
GET /api/v1/vault/transfers?from_date=2025-01-01&to_date=2025-01-10&status=completed
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "transfers": [
      {
        "id": "uuid",
        "transfer_number": "VTR-20250110-00001",
        "transfer_type": "vault_to_branch",
        "to_branch": "Main Branch",
        "currency": "USD",
        "amount": 50000.00,
        "status": "completed",
        "initiated_by": "admin",
        "approved_by": "admin",
        "received_by": "manager1",
        "initiated_at": "2025-01-10T16:00:00Z",
        "completed_at": "2025-01-10T17:00:00Z"
      }
    ],
    "total": 45,
    "summary": {
      "total_sent": 1500000.00,
      "total_received": 900000.00
    }
  }
}
```

### 7.9 Reconcile Vault Balance - تسوية أرصدة الخزينة
```http
POST /api/v1/vault/reconciliation
Authorization: Bearer {access_token}
Content-Type: application/json
Permissions: admin

Request Body:
{
  "currency_id": "usd-uuid",
  "physical_count": 995000.00,
  "notes": "Monthly reconciliation"
}

Response 200:
{
  "success": true,
  "data": {
    "currency": "USD",
    "system_balance": 1000000.00,
    "physical_count": 995000.00,
    "difference": -5000.00,
    "reconciliation_date": "2025-01-10T18:00:00Z",
    "status": "discrepancy",  // or "matched"
    "requires_investigation": true
  }
}
```

---

## 📊 8. Reports

### 8.1 Daily Summary Report - ملخص يومي
```http
GET /api/v1/reports/daily-summary?branch_id=uuid&date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "date": "2025-01-10",
    "branch": {
      "id": "uuid",
      "name": "Main Branch"
    },
    "summary": {
      "total_transactions": 145,
      "total_income": 25000.00,
      "total_expenses": 15000.00,
      "total_exchanges": 450000.00,
      "net_revenue": 10000.00
    },
    "by_type": {
      "income": {
        "count": 25,
        "total": 25000.00
      },
      "expense": {
        "count": 10,
        "total": 15000.00
      },
      "exchange": {
        "count": 100,
        "total": 450000.00
      },
      "transfer": {
        "count": 10,
        "total": 50000.00
      }
    },
    "by_currency": [
      {
        "currency": "USD",
        "volume": 250000.00,
        "transactions": 85
      }
    ]
  }
}
```

### 8.2 Monthly Revenue Report - إيرادات شهرية
```http
GET /api/v1/reports/monthly-revenue?branch_id=uuid&year=2025&month=1
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "period": "2025-01",
    "branch": {...},
    "total_revenue": 350000.00,
    "total_transactions": 2500,
    "average_daily_revenue": 11290.32,
    "daily_breakdown": [
      {
        "date": "2025-01-01",
        "revenue": 12000.00,
        "transactions": 85
      }
    ],
    "by_category": {
      "service_fees": 150000.00,
      "commissions": 200000.00
    }
  }
}
```

### 8.3 Branch Performance Report - أداء الفروع
```http
GET /api/v1/reports/branch-performance?from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "period": {
      "from": "2025-01-01",
      "to": "2025-01-10"
    },
    "branches": [
      {
        "branch": {
          "id": "uuid",
          "name": "Main Branch"
        },
        "total_revenue": 125000.00,
        "total_transactions": 890,
        "average_transaction_value": 140.45,
        "ranking": 1
      },
      {
        "branch": {
          "id": "uuid",
          "name": "North Branch"
        },
        "total_revenue": 85000.00,
        "total_transactions": 650,
        "average_transaction_value": 130.77,
        "ranking": 2
      }
    ],
    "total_revenue": 350000.00,
    "total_transactions": 2500
  }
}
```

### 8.4 Exchange Trends Report - اتجاهات الصرف
```http
GET /api/v1/reports/exchange-trends?currency_pair=USD-SAR&from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "currency_pair": "USD/SAR",
    "period": {
      "from": "2025-01-01",
      "to": "2025-01-10"
    },
    "total_volume": 5000000.00,
    "total_transactions": 1250,
    "average_rate": 3.75,
    "rate_trend": [
      {
        "date": "2025-01-01",
        "buy_rate": 3.75,
        "sell_rate": 3.76,
        "volume": 500000.00
      }
    ],
    "peak_hours": [
      {
        "hour": 10,
        "volume": 250000.00
      }
    ]
  }
}
```

### 8.5 Balance Snapshot - لقطة الأرصدة
```http
GET /api/v1/reports/balance-snapshot?branch_id=uuid&date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "date": "2025-01-10T23:59:59Z",
    "branch": {...},
    "balances": [
      {
        "currency": "USD",
        "balance": 50000.00,
        "opening_balance": 45000.00,
        "total_inflow": 150000.00,
        "total_outflow": 145000.00,
        "net_change": 5000.00
      }
    ],
    "total_value_usd": 250000.00
  }
}
```

### 8.6 Balance Movement Report - حركة الأرصدة
```http
GET /api/v1/reports/balance-movement?branch_id=uuid&currency_id=uuid&from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "branch": {...},
    "currency": "USD",
    "period": {...},
    "opening_balance": 40000.00,
    "closing_balance": 50000.00,
    "net_change": 10000.00,
    "movements": [
      {
        "date": "2025-01-01",
        "inflow": 15000.00,
        "outflow": 12000.00,
        "net": 3000.00,
        "balance": 43000.00
      }
    ]
  }
}
```

### 8.7 Low Balance Alerts - تنبيهات الأرصدة المنخفضة
```http
GET /api/v1/reports/low-balance-alerts
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "total_alerts": 3,
    "critical_alerts": 1,
    "alerts": [
      {
        "branch": {
          "id": "uuid",
          "name": "North Branch"
        },
        "currency": "USD",
        "current_balance": 8000.00,
        "threshold": 10000.00,
        "deficit": -2000.00,
        "severity": "critical",
        "last_updated": "2025-01-10T18:00:00Z"
      }
    ]
  }
}
```

### 8.8 User Activity Report - نشاط المستخدمين
```http
GET /api/v1/reports/user-activity?user_id=uuid&from_date=2025-01-01&to_date=2025-01-10
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "John Teller"
    },
    "period": {...},
    "summary": {
      "total_transactions": 125,
      "total_volume": 500000.00,
      "login_count": 10,
      "total_hours": 80
    },
    "daily_activity": [
      {
        "date": "2025-01-10",
        "transactions": 15,
        "volume": 75000.00,
        "hours_worked": 8
      }
    ]
  }
}
```

### 8.9 Audit Trail Report - سجل التدقيق
```http
GET /api/v1/reports/audit-trail?entity_type=transaction&entity_id=uuid
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "entity_type": "transaction",
    "entity_id": "uuid",
    "events": [
      {
        "id": "uuid",
        "action": "created",
        "user": {
          "id": "uuid",
          "full_name": "John Teller"
        },
        "timestamp": "2025-01-10T10:30:00Z",
        "ip_address": "192.168.1.100",
        "changes": {
          "status": "pending"
        }
      },
      {
        "id": "uuid",
        "action": "completed",
        "user": {...},
        "timestamp": "2025-01-10T10:31:00Z",
        "changes": {
          "status": "completed"
        }
      }
    ]
  }
}
```

### 8.10 Customer Transaction Analysis - تحليل معاملات العميل
```http
GET /api/v1/reports/customer-analysis?customer_id=uuid&from_date=2025-01-01
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "customer": {...},
    "period": {...},
    "summary": {
      "total_transactions": 25,
      "total_volume": 125000.00,
      "average_transaction": 5000.00,
      "most_traded_currency": "USD"
    },
    "transaction_patterns": {
      "peak_day": "Monday",
      "peak_hour": 10,
      "average_frequency": "weekly"
    },
    "risk_indicators": {
      "large_transactions": 3,
      "rapid_succession": false,
      "unusual_patterns": false
    }
  }
}
```

### 8.11 Custom Report - تقرير مخصص
```http
POST /api/v1/reports/custom
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "report_name": "Weekly Branch Comparison",
  "date_range": {
    "from": "2025-01-01",
    "to": "2025-01-07"
  },
  "filters": {
    "branch_ids": ["uuid1", "uuid2"],
    "currency_ids": ["usd-uuid", "eur-uuid"],
    "transaction_types": ["exchange"]
  },
  "group_by": ["branch", "currency"],
  "metrics": ["total_volume", "transaction_count", "commission"]
}

Response 200:
{
  "success": true,
  "data": {
    "report_name": "Weekly Branch Comparison",
    "generated_at": "2025-01-10T20:00:00Z",
    "results": [...]
  }
}
```

### 8.12 Export Report - تصدير تقرير
```http
POST /api/v1/reports/export
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "report_type": "daily_summary",
  "format": "pdf",  // "json", "excel", "pdf"
  "filters": {
    "branch_id": "uuid",
    "date": "2025-01-10"
  }
}

Response 200:
{
  "success": true,
  "data": {
    "download_url": "/exports/daily_summary_20250110.pdf",
    "file_size": 245678,
    "expires_at": "2025-01-11T20:00:00Z"
  }
}

// أو للتحميل المباشر:
Response 200:
Content-Type: application/pdf
Content-Disposition: attachment; filename="daily_summary_20250110.pdf"
[Binary PDF Data]
```

---

## 📊 9. Dashboard

### 9.1 Dashboard Overview - نظرة عامة
```http
GET /api/v1/dashboard/overview?branch_id=uuid
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "today": {
      "date": "2025-01-10",
      "total_transactions": 145,
      "total_revenue": 25000.00,
      "total_volume": 750000.00,
      "active_users": 8
    },
    "branch_status": {
      "total_branches": 5,
      "active_branches": 5,
      "low_balance_alerts": 2
    },
    "pending": {
      "approvals": 3,
      "transfers": 2,
      "verifications": 5
    },
    "top_currencies": [
      {
        "currency": "USD",
        "volume": 450000.00,
        "transactions": 85,
        "percentage": 60.0
      }
    ]
  }
}
```

### 9.2 Dashboard Charts - الرسوم البيانية
```http
GET /api/v1/dashboard/charts?period=weekly&branch_id=uuid
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transaction_volume": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "datasets": [
        {
          "label": "Transaction Volume",
          "data": [125000, 135000, 145000, 132000, 150000, 95000, 45000]
        }
      ]
    },
    "revenue_trend": {
      "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
      "datasets": [
        {
          "label": "Revenue",
          "data": [85000, 92000, 88000, 95000]
        }
      ]
    },
    "currency_distribution": {
      "labels": ["USD", "EUR", "GBP", "SAR"],
      "data": [45, 25, 15, 15]  // percentages
    },
    "branch_comparison": {
      "labels": ["Main", "North", "South", "East", "West"],
      "datasets": [
        {
          "label": "Revenue",
          "data": [125000, 85000, 65000, 55000, 45000]
        }
      ]
    }
  }
}

Query Parameters:
- period: daily|weekly|monthly|yearly
- branch_id: uuid (optional)
- from_date, to_date: للفترة المخصصة
```

### 9.3 Dashboard Alerts - التنبيهات
```http
GET /api/v1/dashboard/alerts
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "total_alerts": 7,
    "critical": 2,
    "warnings": 5,
    "alerts": [
      {
        "id": "uuid",
        "type": "low_balance",
        "severity": "critical",
        "title": "Low Balance Alert",
        "message": "North Branch USD balance is below threshold",
        "branch": {
          "id": "uuid",
          "name": "North Branch"
        },
        "created_at": "2025-01-10T18:00:00Z",
        "is_read": false
      },
      {
        "id": "uuid",
        "type": "pending_approval",
        "severity": "warning",
        "title": "Pending Expense Approval",
        "message": "3 expenses waiting for approval",
        "count": 3,
        "created_at": "2025-01-10T17:30:00Z",
        "is_read": false
      }
    ]
  }
}
```

### 9.4 Quick Statistics - إحصائيات سريعة
```http
GET /api/v1/dashboard/quick-stats?branch_id=uuid
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "today": {
      "transactions": 145,
      "revenue": 25000.00,
      "volume": 750000.00
    },
    "this_week": {
      "transactions": 892,
      "revenue": 165000.00,
      "volume": 4500000.00
    },
    "this_month": {
      "transactions": 2500,
      "revenue": 575000.00,
      "volume": 12500000.00
    },
    "comparison": {
      "vs_yesterday": {
        "transactions": "+12%",
        "revenue": "+8%"
      },
      "vs_last_week": {
        "transactions": "+5%",
        "revenue": "+3%"
      }
    }
  }
}
```

### 9.5 Recent Transactions - آخر المعاملات
```http
GET /api/v1/dashboard/recent-transactions?limit=10
Authorization: Bearer {access_token}

Response 200:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_number": "TRX-20250110-00150",
        "type": "exchange",
        "amount": 1000.00,
        "currency": "USD",
        "customer": "Ahmed Ali",
        "status": "completed",
        "timestamp": "2025-01-10T20:15:00Z"
      }
    ]
  }
}
```

### 9.6 Pending Approvals - الموافقات المعلقة
```http
GET /api/v1/dashboard/pending-approvals
Authorization: Bearer {access_token}
Permissions: admin, manager

Response 200:
{
  "success": true,
  "data": {
    "total": 5,
    "by_type": {
      "expenses": 3,
      "vault_transfers": 2
    },
    "items": [
      {
        "id": "uuid",
        "type": "expense",
        "reference": "TRX-20250110-00125",
        "amount": 5000.00,
        "currency": "SAR",
        "requested_by": "teller1",
        "created_at": "2025-01-10T15:00:00Z",
        "priority": "normal"
      }
    ]
  }
}
```

---

## ⚕️ 10. Health & Status

### 10.1 Health Check
```http
GET /health

Response 200:
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2025-01-10T20:00:00Z"
}
```

### 10.2 System Status
```http
GET /api/v1/status
Authorization: Bearer {access_token}
Permissions: admin

Response 200:
{
  "success": true,
  "data": {
    "api": {
      "status": "operational",
      "version": "1.0.0",
      "uptime_seconds": 345600
    },
    "database": {
      "status": "healthy",
      "connections": {
        "active": 15,
        "idle": 35,
        "total": 50
      },
      "response_time_ms": 12
    },
    "redis": {
      "status": "healthy",
      "memory_used_mb": 45,
      "response_time_ms": 3
    },
    "background_jobs": {
      "status": "running",
      "queue_size": 5
    }
  }
}
```

---

## 🔒 Authentication Headers

جميع الـ endpoints (ماعدا `/health`, `/auth/login`, `/auth/register`) تحتاج:

```http
Authorization: Bearer {access_token}
```

---

## 📋 Common Request/Response Patterns

### Success Response Pattern
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response Pattern
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Pagination Pattern
```
Query Parameters:
- skip: int (default: 0)
- limit: int (default: 50, max: 100)

Response:
{
  "success": true,
  "data": {
    "total": 1250,
    "items": [...],
    "skip": 0,
    "limit": 50
  }
}
```

---

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | بيانات غير صالحة |
| `AUTHENTICATION_ERROR` | 401 | فشل المصادقة |
| `PERMISSION_DENIED` | 403 | لا توجد صلاحية |
| `NOT_FOUND` | 404 | العنصر غير موجود |
| `CONFLICT` | 409 | تعارض في البيانات |
| `INSUFFICIENT_BALANCE` | 422 | رصيد غير كافٍ |
| `TRANSACTION_FAILED` | 422 | فشل المعاملة |
| `RATE_LIMIT_EXCEEDED` | 429 | تجاوز الحد المسموح |
| `INTERNAL_ERROR` | 500 | خطأ داخلي |

---

## 📝 Notes for Frontend Developers

### Authentication Flow
1. POST `/api/v1/auth/login` → get `access_token` + `refresh_token`
2. Store tokens securely (localStorage/sessionStorage)
3. Include `Authorization: Bearer {access_token}` in all requests
4. When access_token expires (401), use refresh_token to get new one
5. If refresh fails, redirect to login

### Pagination
- Always use `skip` and `limit` for large lists
- Default: skip=0, limit=50
- Max limit: 100

### Date Formats
- ISO 8601: `2025-01-10T10:30:00Z`
- Date only: `2025-01-10`
- Always in UTC

### Decimal Numbers
- Use strings or numbers with proper precision
- Example: `1000.00` or `"1000.00"`

### File Uploads
- Use `multipart/form-data`
- Maximum file size: 10MB (adjustable)

### Real-time Updates
- Consider using WebSocket for:
  - Dashboard updates
  - Transaction notifications
  - Alert notifications

---

**End of API Documentation**  
**Last Updated:** November 10, 2025  
**Version:** 1.0
