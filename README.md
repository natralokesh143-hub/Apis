# 🚀 E-Commerce Backend API Documentation (Professional)

## 🌐 Base URL

```
https://apis-8.onrender.com/api/v1
```

---

# 📘 Overview

This API powers a full-featured E-Commerce platform including authentication, product management, cart, payments, and order processing.

* Architecture: RESTful
* Authentication: JWT (Bearer Token)
* Data Format: JSON / multipart-form-data

---

# 🔐 Authentication

## 🔑 Headers for Protected Routes

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📌 Register User

**POST** `/user/register`

### Request Body

```json
{
  "name": "Sai Ganesh",
  "email": "sai@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Status Codes

* 201 Created
* 400 Bad Request

---

## 📌 Login User

**POST** `/user/login`

### Request Body

```json
{
  "email": "sai@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token"
}
```

### Status Codes

* 200 OK
* 401 Unauthorized

---

# 🛒 Product APIs

## 📌 Get All Products

**GET** `/products`

### Response

```json
{
  "success": true,
  "data": []
}
```

---

## 📌 Get Single Product

**GET** `/products/:id`

---

## 📌 Add Product (Admin Only)

**POST** `/products`

### Request Type

`multipart/form-data`

### Fields

* title (string)
* description (string)
* price (number)
* image (file)

### Status Codes

* 201 Created
* 401 Unauthorized
* 403 Forbidden

---

## 📌 Update Product (Admin)

**PUT** `/products/:id`

---

## 📌 Delete Product (Admin)

**DELETE** `/products/:id`

---

# 👤 Profile APIs

## 📌 Get Profile

**GET** `/profile`

---

## 📌 Update Profile

**PUT** `/profile`

### Request Body

```json
{
  "name": "Updated Name",
  "email": "updated@gmail.com",
  "password": "newpassword"
}
```

---

# 🛒 Cart APIs

## 📌 Get Cart

**GET** `/cart`

---

## 📌 Add to Cart

**POST** `/cart`

### Request Body

```json
{
  "productId": "product_id"
}
```

---

# 💳 Payment APIs

## 📌 Checkout

**POST** `/payment/checkout`

### Response

```json
{
  "orderId": "razorpay_order_id",
  "amount": 50000
}
```

---

## 📌 Verify Payment

**POST** `/payment/verify`

### Request Body

```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

---

# 📦 Order APIs

## 📌 Get Orders

**GET** `/orders`

---

## 📌 Get Single Order

**GET** `/orders/:id`

---

# 🔄 Workflow

```
Register → Login → Browse Products → Add to Cart → Checkout → Payment → Verify → Order Created
```

---

# ❌ Error Response Format

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 🔐 Roles & Access Control

| Role  | Permissions          |
| ----- | -------------------- |
| User  | Browse, Cart, Orders |
| Admin | Product Management   |

---

# ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Razorpay
* Cloudinary

---

# 📌 Best Practices Implemented

* Password hashing (bcrypt)
* Token-based authentication
* Modular route structure
* Secure payment verification

---

# 👨‍💻 Author

Sai Ganesh