# Fastify User Management Application

This is a simple user management application built with **Fastify**, **Prisma**, and **Node.js**. It includes user registration, login, and password reset functionalities. The application is designed for personal use, but anyone is welcome to contribute and improve it!

## Features

- User registration with email and password
- User login
- Forgot password functionality with email reset link
- Email sending functionality using SMTP

## Technologies Used

- Fastify: Web framework for Node.js
- Prisma: ORM for database access
- Bcrypt: Password hashing
- Crypto: Secure random tokens for user authentication for password resets
- Nodemailer: Email sending
- SMTP Server: For testing email functionality (which you need to provide)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- bun (optional)
- A relational database (e.g., PostgreSQL, MySQL, SQLite)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ShinniUwU/QuickShield.git
   cd QuickShield
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up your database:**

   Ensure you have a relational database set up and create a `.env` file in the root directory with the following variables:

   ```plaintext
   DATABASE_URL="your_database_connection_string"
   SMTP_HOST="your_smtp_host" 
   SMTP_PORT=465 
   SMTP_USER="your_email" 
   SMTP_PASS="your_email_password"
   ```

4. **Run Prisma migrations:**

   If you have defined your Prisma schema, run the migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server:**

   ```bash
   bun run start
   ```

   The server will start on `http://localhost:3000`.

### Endpoints

- **POST** `/register` - Register a new user.
  - **Request Body:**
    ```json
    {
      "username": "exampleUser",
      "email": "example@example.com",
      "password": "yourPassword"
    }
    ```

- **POST** `/login` - Login an existing user.
  - **Request Body:**
    ```json
    {
      "email": "example@example.com",
      "password": "yourPassword"
    }
    ```

- **POST** `/forgot-password` - Request a password reset link.
  - **Request Body:**
    ```json
    {
      "email": "example@example.com"
    }
    ```

### License

This project is licensed under the MIT License. You are free to use, modify, and distribute it. Contributions are welcome!

### Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. 
