# E-commerce Order System

An e-commerce order management system built with a Spring Boot backend and React frontend. This system allows for managing orders, tracking status, handling user interactions, and role-based access control.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Different permissions for Admin and Viewer roles.
- **Order Management**: Create, Read, Update, and Delete (CRUD) operations for orders.
- **Order Comments**: Add and view comments on specific orders.
- **Dynamic UI**: Modern React frontend with Redux Toolkit for state management.
- **Dual Database Support**: PostgreSQL for production-ready setups and H2 for quick development.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building user interfaces.
- **Redux Toolkit**: State management.
- **Bootstrap**: Styling and layout.
- **Node.js**: Runtime environment.

### Backend
- **Java 17**: Programming language.
- **Spring Boot 3.4.0**: Framework for building the application.
- **Spring Security**: Authentication and authorization (RBAC).
- **Spring Data JPA**: Data persistence.
- **PostgreSQL**: Primary database (running in Docker).
- **H2 Database**: Fallback in-memory database.
- **Gradle**: Build automation tool.

### DevOps
- **Docker & Docker Compose**: Containerization for the database.

## 📋 Prerequisites

Ensure you have the following installed:
- **Java 17**
- **Node.js** (v16 or higher recommended)
- **Docker Desktop** (or Docker Engine + Compose)

## 📂 Project Structure

```
.
├── backend
│   └── order-management  # Spring Boot Application (Port 8090)
├── frontend              # React Application (Port 3000)
└── docker-compose.yml    # Database Configuration
```

## 🏗️ Setup Instructions

### 1. Database Setup (Optional if using H2)

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

### 2. Backend Setup

Navigate to the backend directory and run the application:

```bash
cd backend/order-management
./gradlew bootRun
```

The server will start on `http://localhost:8090`.
- **H2 Console**: `http://localhost:8090/h2-console` (JDBC URL: `jdbc:h2:mem:ordermgmtdb`, User: `sa`, No Password)

### 3. Frontend Setup

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm start
```

The application will be accessible at `http://localhost:3000`.

## 🔐 Authentication & Roles

The system uses HTTP Basic Auth. You can log in with the following credentials:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin` | `password` | Full Access (CRUD + Comments) |
| **Viewer** | `viewer` | `password` | Read Access + Add Comments |

## ⚙️ Configuration

- **Database**: Configured in `backend/order-management/src/main/resources/application.properties`. H2 is enabled by default for ease of use.
- **API Proxy**: The frontend is configured to proxy requests to `http://localhost:8090` (see `frontend/package.json`).
