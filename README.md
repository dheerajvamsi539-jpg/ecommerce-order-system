# E-commerce Order System

An e-commerce order management system built with a Spring Boot backend and React frontend. This system allows for managing orders, tracking status, and handling user interactions.

## Tech Stack

### Frontend
- **React**: UI library for building user interfaces.
- **Redux Toolkit**: State management.
- **Bootstrap**: Styling and layout.
- **Node.js**: Runtime environment.

### Backend
- **Java 17**: Programming language.
- **Spring Boot 3.4.0**: Framework for building the application.
- **Spring Security**: Authentication and authorization.
- **Spring Data JPA**: Data persistence.
- **PostgreSQL**: Primary database (running in Docker).
- **H2 Database**: Fallback in-memory database.
- **Gradle**: Build automation tool.

### DevOps
- **Docker & Docker Compose**: Containerization for the database.

## Prerequisites

Ensure you have the following installed:
- **Java 17**
- **Node.js** (v16 or higher recommended)
- **Docker Desktop** (or Docker Engine + Compose)

## Project Structure

```
.
├── backend
│   └── order-management  # Spring Boot Application
├── frontend              # React Application
└── docker-compose.yml    # Database Configuration
```

## Setup Instructions

### 1. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container listening on port `5432`.

### 2. Backend Setup

Navigate to the backend directory and run the application:

```bash
cd backend/order-management
./gradlew bootRun
```

The server will start on `http://localhost:8080`.

### 3. Frontend Setup

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm start
```

The application will be accessible at `http://localhost:3000`.

## Configuration

- **Database Credentials**: Configured in `backend/order-management/src/main/resources/application.properties` (or `application.yml`). The default configuration expects the credentials defined in `docker-compose.yml`.
- **API Proxy**: The frontend is configured to proxy requests to `http://localhost:8090` (check `frontend/package.json`), ensure your backend port matches this or update the proxy configuration.
