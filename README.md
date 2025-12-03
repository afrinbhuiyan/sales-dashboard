# 📊 Sales Dashboard

A modern, responsive **Sales Dashboard** built with **React**, **Tailwind CSS**, and **Recharts**.  
It displays sales analytics with filters, charts, KPIs, and a paginated transactions table.  
The dashboard fetches sales data from a backend API and allows users to filter by date, price, email, phone number, and more.

---

## 🚀 Features

### 🔍 Filtering & Search
- Filter by **Start Date**, **End Date**
- Filter by **Minimum Price**
- Filter by **Customer Email**
- Filter by **Phone Number**
- Apply Filters button
- Refresh button

### 📈 Analytics Overview
- Total Sales  
- Total Revenue  
- Average Order Value  
- Conversion Rate  
- Growth percentage indicators

### 📊 Sales Over Time Chart
- Line chart showing:
  - Total Sales
  - Revenue
- Built using **Recharts**

### 📑 Sales Transactions Table
- Fully responsive table
- Sorting options
- Pagination
- Status indicators:
  - Completed
  - Pending
  - Cancelled

### 🎨 UI & UX
- Modern dark UI  
- Tailwind CSS  
- Clean, minimal, responsive layout  

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | React Hooks |
| Icons | Lucide / Heroicons |
| Build Tool | Vite |

---

## 📂 Project Structure

```
sales-dashboard/
 ├── src/
 │   ├── components/
 │   │   ├── Header.jsx
 │   │   ├── Filters.jsx
 │   │   ├── StatsCards.jsx
 │   │   ├── SalesChart.jsx
 │   │   ├── SalesTable.jsx
 │   ├── pages/
 │   │   ├── Dashboard.jsx
 │   ├── assets/
 │   ├── App.jsx
 │   ├── main.jsx
 ├── public/
 ├── package.json
 ├── README.md
 └── index.html
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/sales-dashboard.git
cd sales-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🌐 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📡 API Integration

The app fetches data from your backend API (example):

```
GET /api/sales?startDate=&endDate=&minPrice=&email=&phone=
```

Make sure your backend returns:

- totalSales  
- totalRevenue  
- avgOrderValue  
- conversionRate  
- chartData  
- tableData  

---

## 🖼 Screenshot

(Add your dashboard screenshot here)

```
![Dashboard Screenshot](./screenshot.png)
```

---

## 📜 License

This project is open-source and free to use.
