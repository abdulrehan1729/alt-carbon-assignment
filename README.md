# Carbon Project Monitoring & Analytics API

## Overview

This is a **scalable** and **secure** RESTful API for tracking, analyzing, and optimizing carbon removal projects across different locations. It provides robust **project management**, **geospatial operations**, and **analytical insights** to monitor carbon impact effectively.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with geospatial indexing
-   **Authentication:** JWT-based authentication with role-based access control

---

## Features

### ✅ Core Features

-   User authentication & Role-based access (ADMIN, EDITOR, VIEW_ONLY)
-   CRUD operations for project management
-   Advanced filtering, search, and pagination

### 🌍 Geospatial Operations

-   Find projects **within a radius**
-   Find projects **inside a polygonal region**
-   Detect overlapping projects

### 📊 Analytics

-   Regional performance metrics
-   Time-series analysis
-   Carbon impact forecasting

### ⚡ Performance & Security

-   Rate limiting & request validation
-   Error handling with proper status codes
-   Efficient database indexing

---

## Installation & Setup

### **1️⃣ Clone the Repository**

```sh
 git clone <repository-url>
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Environment Variables**

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/carbon_monitoring
JWT_SECRET=your_secret_key
```

### **4️⃣ Start the Server**

```sh
npm start
```

The server will start on `http://localhost:5000`

---

## API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login & get JWT token |

### 🌱 Project Management

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/projects`     | Create a new project              |
| GET    | `/api/projects`     | Get all projects (with filtering) |
| GET    | `/api/projects/:id` | Get project details by ID         |
| PUT    | `/api/projects/:id` | Update project details            |
| DELETE | `/api/projects/:id` | Delete a project                  |

### 🌍 Geospatial Operations

| Method | Endpoint                                                                                                       | Description                        |
| ------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| GET    | `/api/projects/nearby?lng=-118.237&lat=34.056&radius=10`                                                       | Find projects within a radius (km) |
| GET    | `/api/projects/within?coordinates=[[[-118.237,34.056],[-118.240,34.060],[-118.250,34.065],[-118.237,34.056]]]` | Find projects inside a polygon     |

### 📊 Analytics

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| GET    | `/api/projects/analytics/forecast` | Forecast carbon impact  |
| POST   | `/api/projects/analytics/report`   | Generate custom reports |

---

## Request Examples

### **Create a New Project**

```sh
curl -X POST "http://localhost:5000/api/projects" \
     -H "Content-Type: application/json" \
     -d '{
         "name": "Forest Restoration",
         "description": "Reforestation in Amazon",
         "location": { "type": "Point", "coordinates": [-60.025, -3.465] },
         "area_hectares": 500,
         "start_date": "2024-01-01T00:00:00.000Z",
         "project_type": "reforestation",
         "metrics": {
             "carbon_removal_rate": 300,
             "total_carbon_removed": 1200
         },
         "status": "active"
     }'
```

### **Find Projects Within a Polygon**

```sh
curl -X GET "http://localhost:5000/api/projects/within?coordinates=[[[-118.237,34.056],[-118.240,34.060],[-118.250,34.065],[-118.237,34.056]]]"
```

### **Generate Carbon Impact Report**

```sh
curl -X POST "http://localhost:5000/api/analytics/report" \
     -H "Content-Type: application/json" \
     -d '{
         "region": "Amazon",
         "start_date": "2023-01-01",
         "end_date": "2024-01-01",
         "metrics": ["carbon_removal_rate", "biodiversity_index"]
     }'
```

---

---

## Contact

For queries, feel free to reach out at `abdulrehan1729@gmail.com`
