# 🗄️ THIẾT KẾ DATABASE
## Giai Đoạn 3A: Database Design

---

## 1. ENTITY RELATIONSHIP DIAGRAM (ERD)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ user_id (PK)    │
│ username        │
│ email           │
│ password        │
│ full_name       │
│ phone           │
│ role            │
│ status          │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        ├─────────────────────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│   EMPLOYEES      │         │     ORDERS       │
├──────────────────┤         ├──────────────────┤
│ employee_id (PK) │         │ order_id (PK)    │
│ user_id (FK)     │         │ user_id (FK)     │
│ employee_code    │         │ table_id (FK)    │
│ position         │         │ customer_name    │
│ hire_date        │         │ order_date       │
│ salary           │         │ status           │
│ status           │         │ total_amount     │
└──────────────────┘         │ discount_amount  │
                             │ final_amount     │
                             │ payment_method   │
                             │ notes            │
                             │ created_at       │
                             └──────────────────┘
                                     │
                                     │ 1:N
                                     ▼
                             ┌──────────────────────┐
                             │  ORDER_DETAILS       │
                             ├──────────────────────┤
                             │ order_detail_id (PK) │
                             │ order_id (FK)        │
                             │ product_id (FK)      │
                             │ quantity             │
                             │ unit_price           │
                             │ total_price          │
                             │ notes                │
                             └──────────────────────┘
                                     │
                                     │ N:1
                                     ▼
                             ┌──────────────────────┐
                             │    PRODUCTS          │
                             ├──────────────────────┤
                             │ product_id (PK)      │
                             │ category_id (FK)     │
                             │ product_name         │
                             │ description          │
                             │ price                │
                             │ cost                 │
                             │ image_url            │
                             │ quantity_in_stock    │
                             │ status               │
                             │ created_at           │
                             └──────────────────────┘
                                     │
                                     │ N:1
                                     ▼
                             ┌──────────────────────┐
                             │   CATEGORIES         │
                             ├──────────────────────┤
                             │ category_id (PK)     │
                             │ category_name        │
                             │ description          │
                             │ image_url            │
                             │ display_order        │
                             │ status               │
                             └──────────────────────┘

┌─────────────────┐
│  TABLES         │
├─────────────────┤
│ table_id (PK)   │
│ table_number    │
│ area            │
│ capacity        │
│ status          │
└─────────────────┘
        │
        │ 1:N
        ▼
┌──────────────────┐
│ SHIFTS           │
├──────────────────┤
│ shift_id (PK)    │
│ employee_id (FK) │
│ shift_name       │
│ start_time       │
│ end_time         │
│ date             │
└──────────────────┘

┌──────────────────┐
│ INVOICES         │
├──────────────────┤
│ invoice_id (PK)  │
│ order_id (FK)    │
│ invoice_number   │
│ invoice_date     │
│ total_amount     │
│ tax_amount       │
│ final_amount     │
│ payment_status   │
│ notes            │
└──────────────────┘
```

---

## 2. NORMALIZATION

### **Bước 1: First Normal Form (1NF)**
- ✅ Tất cả attributes là atomic (không chia nhỏ được)
- ✅ Không có repeating groups
- ✅ Mỗi bàn ghi có ID duy nhất

### **Bước 2: Second Normal Form (2NF)**
- ✅ Thỏa mãn 1NF
- ✅ Mỗi non-key attribute phụ thuộc hoàn toàn vào PK
- ✅ Không có partial dependencies

### **Bước 3: Third Normal Form (3NF)**
- ✅ Thỏa mãn 2NF
- ✅ Không có transitive dependencies
- ✅ Tất cả non-key attributes phụ thuộc trực tiếp vào PK

**Kết luận:** Database thiết kế ở 3NF, không bị dư thừa, dữ liệu nhất quán.

---

## 3. CHI TIẾT CỬ BẢNG
### **Bảng 1: USERS**
```sql
Column Name      | Data Type        | Constraints          | Mô tả
└─────────────────┴──────────────────┴──────────────────────┴─────────────
user_id          | INT              | PRIMARY KEY, AUTO_INC | ID người dùng
username         | VARCHAR(50)      | UNIQUE, NOT NULL      | Tên đăng nhập
email            | VARCHAR(100)     | UNIQUE, NOT NULL      | Email
password         | VARCHAR(255)     | NOT NULL              | Mật khẩu (hash)
full_name        | VARCHAR(100)     | NOT NULL              | Tên đầy đủ
phone            | VARCHAR(20)      | -                      | Số điện thoại
role             | ENUM             | NOT NULL              | Admin/Staff/Customer
status           | ENUM             | DEFAULT 'active'      | Active/Inactive
created_at       | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
updated_at       | TIMESTAMP        | ON UPDATE CURRENT     | Ngày cập nhật
```

### **Bảng 2: CATEGORIES**
```sql
Column Name      | Data Type        | Constraints          | Mô tả
└─────────────────┴──────────────────┴──────────────────────┴─────────────
category_id      | INT              | PRIMARY KEY, AUTO_INC | ID danh mục
category_name    | VARCHAR(100)     | UNIQUE, NOT NULL      | Tên danh mục
description      | TEXT             | -                      | Mô tả
image_url        | VARCHAR(255)     | -                      | URL hình ảnh
display_order    | INT              | DEFAULT 1             | Thứ tự hiển thị
status           | ENUM             | DEFAULT 'active'      | Active/Inactive
created_at       | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

### **Bảng 3: PRODUCTS**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
product_id          | INT              | PRIMARY KEY, AUTO_INC | ID sản phẩm
category_id         | INT              | FOREIGN KEY          | Danh mục
product_name        | VARCHAR(100)     | NOT NULL              | Tên sản phẩm
description         | TEXT             | -                      | Mô tả chi tiết
price               | DECIMAL(10,2)    | NOT NULL              | Giá bán
cost                | DECIMAL(10,2)    | -                      | Giá vốn
image_url           | VARCHAR(255)     | -                      | URL hình ảnh
quantity_in_stock   | INT              | DEFAULT 0             | Tồn kho
status              | ENUM             | DEFAULT 'active'      | Active/Inactive
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
updated_at          | TIMESTAMP        | ON UPDATE CURRENT     | Cập nhật
```

### **Bảng 4: ORDERS**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
order_id            | INT              | PRIMARY KEY, AUTO_INC | ID đơn hàng
user_id             | INT              | FOREIGN KEY           | Staff tạo
table_id            | INT              | FOREIGN KEY           | Bàn phục vụ
customer_name       | VARCHAR(100)     | -                      | Tên khách
order_date          | TIMESTAMP        | DEFAULT CURRENT       | Ngày đặt
status              | ENUM             | DEFAULT 'pending'     | Pending/Confirmed/Delivered/Paid
total_amount        | DECIMAL(10,2)    | DEFAULT 0             | Tổng tiền chưa giảm
discount_percent    | DECIMAL(5,2)     | DEFAULT 0             | % giảm giá
discount_amount     | DECIMAL(10,2)    | DEFAULT 0             | Số tiền giảm
final_amount        | DECIMAL(10,2)    | DEFAULT 0             | Tổng tiền cuối
payment_method      | ENUM             | -                      | Cash/Card/E-wallet
notes               | TEXT             | -                      | Ghi chú
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

### **Bảng 5: ORDER_DETAILS**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
order_detail_id     | INT              | PRIMARY KEY, AUTO_INC | ID chi tiết
order_id            | INT              | FOREIGN KEY           | Đơn hàng
product_id          | INT              | FOREIGN KEY           | Sản phẩm
quantity            | INT              | NOT NULL, > 0         | Số lượng
unit_price          | DECIMAL(10,2)    | NOT NULL              | Giá từng cái
total_price         | DECIMAL(10,2)    | NOT NULL              | Thành tiền
notes               | VARCHAR(255)     | -                      | Ghi chú
```

### **Bảng 6: EMPLOYEES**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
employee_id         | INT              | PRIMARY KEY, AUTO_INC | ID nhân viên
user_id             | INT              | FOREIGN KEY           | Liên hệ người dùng
employee_code       | VARCHAR(20)      | UNIQUE, NOT NULL      | Mã nhân viên
full_name           | VARCHAR(100)     | NOT NULL              | Tên nhân viên
email               | VARCHAR(100)     | -                      | Email
phone               | VARCHAR(20)      | -                      | Điện thoại
position            | VARCHAR(50)      | -                      | Vị trí (Chef, Waiter, etc)
hire_date           | DATE             | NOT NULL              | Ngày tuyển
salary              | DECIMAL(10,2)    | DEFAULT 0             | Lương cơ bản
status              | ENUM             | DEFAULT 'working'     | Working/On-leave/Resigned
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

### **Bảng 7: TABLES**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
table_id            | INT              | PRIMARY KEY, AUTO_INC | ID bàn
table_number        | INT              | UNIQUE, NOT NULL      | Số bàn
area                | VARCHAR(50)      | -                      | Khu vực (Hall, VIP, Private)
capacity            | INT              | DEFAULT 2             | Sức chứa
status              | ENUM             | DEFAULT 'available'   | Available/Occupied/Reserved
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

### **Bảng 8: SHIFTS**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
shift_id            | INT              | PRIMARY KEY, AUTO_INC | ID ca
employee_id         | INT              | FOREIGN KEY           | Nhân viên
shift_name          | VARCHAR(50)      | NOT NULL              | Sáng/Chiều/Tối
start_time          | TIME             | NOT NULL              | Giờ bắt đầu
end_time            | TIME             | NOT NULL              | Giờ kết thúc
shift_date          | DATE             | NOT NULL              | Ngày làm
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

### **Bảng 9: INVOICES**
```sql
Column Name         | Data Type        | Constraints          | Mô tả
└────────────────────┴──────────────────┴──────────────────────┴─────────────
invoice_id          | INT              | PRIMARY KEY, AUTO_INC | ID hóa đơn
order_id            | INT              | FOREIGN KEY           | Liên hệ đơn hàng
invoice_number      | VARCHAR(50)      | UNIQUE, NOT NULL      | Số hóa đơn
invoice_date        | TIMESTAMP        | DEFAULT CURRENT       | Ngày lập hóa đơn
total_amount        | DECIMAL(10,2)    | NOT NULL              | Tổng tiền
tax_amount          | DECIMAL(10,2)    | DEFAULT 0             | Tiền thuế (nếu có)
final_amount        | DECIMAL(10,2)    | NOT NULL              | Tổng cuối cùng
payment_status      | ENUM             | DEFAULT 'unpaid'      | Paid/Unpaid/Refunded
notes               | TEXT             | -                      | Ghi chú
created_at          | TIMESTAMP        | DEFAULT CURRENT       | Ngày tạo
```

---

## 4. INDEXES

Để tối ưu hóa hiệu suất truy vấn:

```sql
-- Tìm kiếm user nhanh
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Tìm kiếm sản phẩm theo danh mục
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(product_name);

-- Tìm kiếm đơn hàng
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

-- Tìm chi tiết đơn hàng
CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_product ON order_details(product_id);

-- Tìm nhân viên
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_code ON employees(employee_code);

-- Tìm ca làm việc
CREATE INDEX idx_shifts_employee ON shifts(employee_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);

-- Tìm hóa đơn
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
```

---

## 5. KEYS & CONSTRAINTS

### **Primary Keys (PK)**
- Mỗi bảng có 1 PK duy nhất, auto-increment

### **Foreign Keys (FK)**
| Bảng | FK | Tham chiếu | Hành động |
|------|----|---------|---------| 
| products | category_id | categories | ON DELETE RESTRICT |
| orders | user_id | users | ON DELETE RESTRICT |
| orders | table_id | tables | ON DELETE RESTRICT |
| order_details | order_id | orders | ON DELETE CASCADE |
| order_details | product_id | products | ON DELETE RESTRICT |
| employees | user_id | users | ON DELETE CASCADE |
| shifts | employee_id | employees | ON DELETE CASCADE |
| invoices | order_id | orders | ON DELETE RESTRICT |

### **Unique Constraints**
```
UNIQUE(users.email)
UNIQUE(users.username)
UNIQUE(categories.category_name)
UNIQUE(products.product_name, category_id)
UNIQUE(employees.employee_code)
UNIQUE(tables.table_number)
UNIQUE(invoices.invoice_number)
```

---

## 📄 Tiếp theo: Xem file SQL Scripts
Xem file: `schema.sql` và `data.sql` trong thư mục Database/
