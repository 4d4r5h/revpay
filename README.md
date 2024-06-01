# RevPay API

RevPay API is a RESTful service designed for managing businesses and their associated bank accounts. It allows businesses to register, create multiple accounts, perform transactions, and check balances. The API uses Express.js and MongoDB, with JWT for authentication and bcrypt for password hashing.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Windows](#windows)
  - [Linux](#linux)
- [Endpoints](#endpoints)
  - [Authentication](#authentication)
  - [Account Management](#account-management)
  - [Transaction Management](#transaction-management)
- [Models](#models)
- [Middleware and Controllers](#middleware-and-controllers)
- [Security](#security)
  - [JWT Tokens](#jwt-tokens)
  - [Bcrypt Algorithm](#bcrypt-algorithm)
- [Concurrency](#concurrency)

## Features

- Business registration and login
- Account creation and management
- Deposit and withdrawal transactions
- Daily withdrawal limits
- Balance inquiry
- JWT-based authentication

## Prerequisites

- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm (v6.x or higher)

## Installation

### Windows

1. Clone the repository:
    ```sh
    git clone https://github.com/4d4r5h/revpay.git
    cd revpay
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the project root and add your configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```sh
    npm run dev
    ```

### Linux

1. Clone the repository:
    ```sh
    git clone https://github.com/4d4r5h/revpay.git
    cd revpay
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the project root and add your configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```sh
    npm run dev
    ```

## Endpoints

### Authentication

#### Register a New Business

- **URL**: `POST /api/auth/register`
- **Description**: Registers a new business with a username and password.
- **Request Body**:
    ```json
    {
        "username": "business_name",
        "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
        "_id": "unique_business_id",
        "username": "business_name",
        "token": "jwt_token"
    }
    ```

#### Login a Business

- **URL**: `POST /api/auth/login`
- **Description**: Logs in a business and returns a JWT token.
- **Request Body**:
    ```json
    {
        "username": "business_name",
        "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
        "_id": "unique_business_id",
        "username": "business_name",
        "token": "jwt_token"
    }
    ```

### Account Management

#### Create a New Account

- **URL**: `POST /api/accounts`
- **Description**: Creates a new account for the authenticated business.
- **Request Headers**:
    ```http
    Authorization: Bearer jwt_token
    ```
- **Request Body**:
    ```json
    {
        "accountNumber": "1234567890",
        "sortCode": "12345678"
    }
    ```
- **Response**:
    ```json
    {
        "_id": "unique_account_id",
        "business": "unique_business_id",
        "accountNumber": "1234567890",
        "sortCode": "12345678",
        "status": "ACTIVE",
        "allowCredit": true,
        "allowDebit": true,
        "dailyWithdrawalLimit": 1000,
        "balance": 0
    }
    ```

#### Get All Accounts for a Business

- **URL**: `GET /api/accounts`
- **Description**: Retrieves all accounts for the authenticated business.
- **Request Headers**:
    ```http
    Authorization: Bearer jwt_token
    ```
- **Response**:
    ```json
    [
        {
            "_id": "unique_account_id_1",
            "business": "unique_business_id",
            "accountNumber": "1234567890",
            "sortCode": "12345678",
            "status": "ACTIVE",
            "allowCredit": true,
            "allowDebit": true,
            "dailyWithdrawalLimit": 1000,
            "balance": 0
        },
        {
            "_id": "unique_account_id_2",
            "business": "unique_business_id",
            "accountNumber": "0987654321",
            "sortCode": "87654321",
            "status": "ACTIVE",
            "allowCredit": true,
            "allowDebit": true,
            "dailyWithdrawalLimit": 1000,
            "balance": 0
        }
    ]
    ```

### Transaction Management

#### Create a Transaction (Deposit or Withdrawal)

- **URL**: `POST /api/transactions`
- **Description**: Creates a deposit or withdrawal transaction for an account.
- **Request Headers**:
    ```http
    Authorization: Bearer jwt_token
    ```
- **Request Body**:
    ```json
    {
        "accountNumber": "1234567890",
        "type": "CREDIT", // or "DEBIT"
        "amount": 500
    }
    ```
- **Response**:
    ```json
    {
        "_id": "unique_transaction_id",
        "account": "unique_account_id",
        "type": "CREDIT",
        "amount": 500,
        "date": "2024-05-31T12:00:00.000Z"
    }
    ```

#### Get the Balance of an Account

- **URL**: `GET /api/transactions/balance/:accountNumber`
- **Description**: Retrieves the balance of a specific account.
- **Request Headers**:
    ```http
    Authorization: Bearer jwt_token
    ```
- **Response**:
    ```json
    {
        "balance": 1500
    }
    ```

## Models

### Business

- **Fields**:
  - `username`: String, required, unique
  - `password`: String, required
- **Pre-save Hook**: Hashes the password before saving
- **Methods**: 
  - `matchPassword`: Compares entered password with hashed password

### Account

- **Fields**:
  - `business`: ObjectId (reference to Business), required
  - `accountNumber`: String, required, unique, maxlength: 10
  - `sortCode`: String, required, maxlength: 8
  - `status`: Enum (ACTIVE, INACTIVE), default: ACTIVE
  - `allowCredit`: Boolean, default: true
  - `allowDebit`: Boolean, default: true
  - `dailyWithdrawalLimit`: Number, default: 1000
  - `balance`: Number, default: 0

### Transaction

- **Fields**:
  - `account`: ObjectId (reference to Account), required
  - `type`: Enum (CREDIT, DEBIT), required
  - `amount`: Number, required
  - `date`: Date, default: Date.now

## Middleware and Controllers

### Middleware

**authMiddleware.js**

- **Purpose**: Protect routes by ensuring the request has a valid JWT token.
- **Function**: Decodes the token, verifies it, and attaches the authenticated business to the request object.

### Controllers

**authController.js**

- **registerBusiness**: Handles business registration, hashes the password, and returns a JWT token.
- **loginBusiness**: Authenticates a business, verifies the password, and returns a JWT token.

**accountController.js**

- **createAccount**: Creates a new account for the authenticated business.
- **getAccounts**: Retrieves all accounts for the authenticated business.

**transactionController.js**

- **createTransaction**: Handles deposit and withdrawal transactions, checks transaction type and account status, and updates the account balance.
- **getBalance**: Retrieves the balance of a specific account.

## Security

### JWT Tokens

- **Purpose**: Securely transmit information between parties as a JSON object.
- **Usage**: Tokens are used to authenticate and authorize users by ensuring the requests come from authenticated sources.
- **Implementation**: Tokens are signed with a secret and attached to the `Authorization` header of HTTP requests. These can be generated using <code>require('crypto').randomBytes(64).toString('hex')</code>

### Bcrypt Algorithm

- **Purpose**: Securely hash passwords to protect against brute force attacks.
- **Usage**: Passwords are hashed before saving to the database and compared during authentication.
- **Implementation**: Uses bcrypt's `genSalt` and `hash` methods to hash passwords and `compare` to verify them.

## Concurrency

The current project does not handle concurrency issues such as race conditions. To solve concurrency problems, consider using the following approaches:

- **MongoDB Transactions**: Use MongoDB transactions to ensure atomicity of operations.
- **Optimistic Concurrency Control**: Implement versioning to handle concurrent updates.
- **Locks**: Use distributed locks (e.g., Redis-based locks) to ensure serialized access to critical sections of the code.
