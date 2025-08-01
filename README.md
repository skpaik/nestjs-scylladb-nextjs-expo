# E-commerce Full-Stack Application

A modern full-stack e-commerce application built with **NestJS**, **Next.js**, and **Expo**. This project features a scalable architecture with a ScyllaDB database, comprehensive API documentation, and cross-platform mobile support.

## 🏗️ Project Architecture

This project consists of three main components:

- **Backend (NestJS)**: RESTful API with ScyllaDB database
- **Web Frontend (Next.js)**: Modern web application with Tailwind CSS and Radix UI
- **Mobile App (Expo)**: Cross-platform mobile application with React Native

## 📁 Project Structure

```
nestjs-scylladb-nextjs-expo/
├── server/         # NestJS backend with ScyllaDB
├── web/            # Next.js web frontend
└── mobile/         # Expo React Native mobile app
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn package manager

### 1. Backend Setup (NestJS + ScyllaDB)

```bash
cd server

# Install dependencies
npm install

# Start ScyllaDB database
./docker.sh

# Start the development server
./run.sh
```

The backend will be available at:
- **API Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

### 2. Web Frontend Setup (Next.js)

```bash
cd web

# Install dependencies
npm install

# Start the development server
./run.sh
```

The web application will be available at: http://localhost:3001

### 3. Mobile App Setup (Expo)

```bash
cd mobile

# Install dependencies
npm install

# Start the Expo development server
./run.sh
```

The mobile app will show a QR code and link. You can:
- Open the link in your local browser
- Download the **Expo Go** app from your device's app store
- Scan the QR code with **Expo Go** (ensure your device and PC are on the same WiFi network)

## 🗄️ Database

The application uses **ScyllaDB** (a Cassandra-compatible database) for data storage:

- **Port**: 9042
- **Initialization**: Automatically set up with sample product data
- **Schema**: Defined in `server/scripts/init.cql`

## 📚 API Endpoints

The backend provides a comprehensive REST API with the following main endpoints:

### Products
- `GET /products` - Get all products with pagination and filtering
- `GET /products/search` - Search products by name and description
- `GET /products/latest` - Get latest products
- `GET /products/featured` - Get featured products
- `GET /products/categories` - Get all product categories
- `GET /products/brands` - Get all product brands
- `GET /products/category/:category` - Get products by category
- `GET /products/brand/:brand` - Get products by brand
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

## 🧪 Testing

### Backend API Testing

```bash
cd server/scripts
./test-products.sh
```

This script will test the main product endpoints with sample data.

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: ScyllaDB (Cassandra-compatible)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

### Web Frontend
- **Framework**: Next.js 13
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context
- **HTTP Client**: Axios

### Mobile App
- **Framework**: Expo with React Native
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide icons
- **HTTP Client**: Axios

## 🔧 Development Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Web Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Mobile App
- `npm run dev` - Start Expo development server
- `npm run build:web` - Build for web platform

## 🌐 CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000 (backend)
- http://localhost:3001 (web frontend)
- http://localhost:8080 (mobile app)

## 📱 Mobile App Features

- Cross-platform support (iOS, Android, Web)
- Product browsing and search
- Shopping cart functionality
- Responsive design with gesture support
- Real-time updates

## 🎨 Web App Features

- Modern, responsive UI with Tailwind CSS
- Comprehensive component library
- Product catalog with filtering and search
- Shopping cart management
- Beautiful animations and transitions

## 🔍 API Documentation

Once the backend is running, you can access the interactive API documentation at:
**http://localhost:3000/api-docs**

This provides a complete reference for all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.