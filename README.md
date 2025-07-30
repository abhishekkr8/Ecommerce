# 🛍️ ECommerce App

A full-featured e-commerce web application with both **Admin** and **User** views, built using **React**, **Redux Toolkit**, **Tailwind CSS**, **Express.js**, and **MongoDB**. It provides seamless shopping, product management, and secure authentication features.

## 🔥 Live Demo

🌐 [View Demo](https://ecommerce-75.vercel.app)

## 📸 Screenshots

| Home Page                        | Product Page                      |
|----------------------------------|-----------------------------------|
| ![Home](image.png)    | ![Product](screenshots/product.png) |

## ✨ Features

### 👥 User Side
- ✅ Signup/Login with JWT
- 🛍️ Browse Products by Categories
- 🧺 Add to Cart & Checkout
- 💳 Order Management
- ⭐ Add & View Reviews
- 🔍 Search Functionality

### 🛠️ Admin Panel
- 📦 Create/Update/Delete Products
- 📊 Dashboard View
- 📁 Manage Orders & Customers
- 🔐 Secure Routes for Admin

### ⚙️ Tech Stack
- **Frontend**: React, Redux Toolkit, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, Cookies, Token
- **Cloud Storage**: Cloudinary (for product images)

---

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abhishekkr8/Ecommerce
   ```

2. Navigate to the project directory:

   ```bash
   cd Ecommerce
   ```

3. Install dependencies for both the client and server:

   ```bash
   cd client && npm install
   cd server && npm install
   ```

4. Start the server:

   ```bash
   cd server && npm run dev
   ```

   This will start the server on `http://localhost:9000`.

5. Start the client (in a new terminal window):

   ```bash
   cd client && npm run dev
   ```

   This will start the client on `http://localhost:5173`.

## 🤝 Contributing
Fork the repo

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a pull request