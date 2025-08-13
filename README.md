# Family FinanceFlow - Personal Finance Tracker

Welcome to Family FinanceFlow! This is a modern, responsive web application designed to help you and your family manage income, expenses, and budgets. It leverages the power of the Google Gemini API to provide AI-powered features like personalized financial tips and dream planning.

This is a full-stack application with a React frontend and a Node.js/Express backend that uses a MySQL database.

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed on your system:

1.  **[Node.js](https://nodejs.org/en/)**: Required to run the backend server.
2.  **[MySQL](https://dev.mysql.com/downloads/mysql/)**: The database for storing user data.
3.  **[Visual Studio Code](https://code.visualstudio.com/)**: The recommended code editor.
4.  **[Live Server (VSCode Extension)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)**: The easiest way to run the frontend. Please install this extension from the VSCode Marketplace.

---

## 🚀 Running the Project in VSCode (Step-by-Step Guide)

To run this project, you will need two separate terminal windows open inside VSCode: one for the backend and one for the frontend.

### Step 1: Open the Project in VSCode

First, open the main project folder in Visual Studio Code.

### Step 2: Backend Setup (Terminal 1)

Let's get the database and backend server running first.

1.  **Create the Database:**
    Open your MySQL client (like MySQL Workbench or the command line) and run the following SQL command to create the database that the app will use:
    ```sql
    CREATE DATABASE finance_flow;
    ```

2.  **Open a New Terminal in VSCode:**
    You can do this from the top menu: `Terminal` -> `New Terminal`.

3.  **Navigate to the Backend Directory:**
    In the terminal, type:
    ```bash
    cd backend
    ```

4.  **Set Up Environment Variables:**
    The backend needs your database credentials and API key.
    *   Create a new file in the `backend` directory named `.env`.
    *   Copy the content below into the `.env` file.
    *   **IMPORTANT:** Replace the placeholder values (`your_actual_mysql_password_here`, etc.) with your **real** credentials.

    ```env
    # === Database Credentials ===
    # For security, do not use 'root' or hardcoded passwords in production.
    # This is for local development only.
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_actual_mysql_password_here
    DB_NAME=finance_flow

    # === JWT Secret for signing authentication tokens ===
    # You can use any long, random string here.
    JWT_SECRET=your-super-secret-key-that-is-long-and-random
    
    # === Google Gemini API Key ===
    # Get a free key from Google AI Studio: https://aistudio.google.com/app/apikey
    API_KEY=your_actual_google_api_key_here
    ```

5.  **Install Dependencies:**
    In the same terminal (while inside the `backend` folder), run:
    ```bash
    npm install
    ```

6.  **Start the Backend Server:**
    Now, start the server:
    ```bash
    npm start
    ```

7.  **✅ Verification:**
    If successful, you will see messages in the terminal like:
    `Connecting to database...`
    `Database connected successfully.`
    `All tables are ready.`
    `Backend server is running on http://localhost:3001`

    **Keep this terminal open!** The backend is now running and waiting for requests from the frontend.

### Step 3: Frontend Setup (Terminal 2)

Now, let's get the user interface running.

1.  **Open a Second Terminal in VSCode:**
    Create another new terminal (`Terminal` -> `New Terminal`). You should now have two terminals.

2.  **Run with Live Server (Recommended):**
    *   In the VSCode File Explorer, find the `index.html` file in the root of the project.
    *   **Right-click** on `index.html`.
    *   Select **"Open with Live Server"** from the context menu.

3.  **✅ Verification:**
    Your default web browser should automatically open a new tab to a URL like `http://127.0.0.1:5500/index.html`. You will see the Family FinanceFlow login page.

**That's it! The application is now fully running.** The frontend (in your browser) will automatically connect to the backend (running on `localhost:3001`). You can now sign up for a new account and start using the app.

---

### How The Frontend and Backend Connect

The React application running in your browser is already configured to send API requests (like for signing up, logging in, or saving data) to `http://localhost:3001/api`. The `authService.ts` file handles this communication. As long as both servers are running as described above, they will work together seamlessly.

---

## 🤔 Troubleshooting

### **Most Common Problem: "Connection Failed" or "Could not connect"**

If you see a connection error in the app, it means the frontend is running but **the backend server has crashed or failed to start.**

The **backend terminal window** is your most important tool for debugging this. The real error message is there.

---

### **Foolproof 4-Step Fix**

Follow these steps exactly to solve the connection problem.

#### Step 1: Find the *Real* Error

1.  Go to the VSCode terminal window where you ran `npm start` for the backend.
2.  Look at the last few lines. You will see a specific error message.
    *   If it says `Access denied for user 'root'@'localhost'`, your `DB_PASSWORD` in the `.env` file is wrong.
    *   If it says `FATAL ERROR: API_KEY is not defined`, you forgot to add your Google API Key to the `.env` file.
    *   If it says `Unknown database 'finance_flow'`, you did not run `CREATE DATABASE finance_flow;` in MySQL first.

#### Step 2: Fix Your `backend/.env` File

1.  Open the file located at `backend/.env`.
2.  Based on the credentials you provided (`user=root`, `password=nisarga@202003`), your file **must** look exactly like this.
3.  **Copy and paste the entire block below into your `.env` file.** Then, just add your own Google API key.

    ```env
    # === Database Credentials ===
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=finance_flow

    # === JWT Secret for signing authentication tokens ===
    JWT_SECRET=this-can-be-any-long-random-string-you-make-up
    
    # === Google Gemini API Key === get from https://aistudio.google.com/app/apikey
    API_KEY=your_actual_google_api_key_here
    ```

#### Step 3: Restart the Backend Server

1.  Go back to your backend terminal.
2.  If the server is running, stop it by pressing `Ctrl + C`.
3.  Start it again by running:
    ```bash
    npm start
    ```

#### Step 4: Verify Success

1.  Watch the terminal output carefully. You **must** see the following messages. If you see any errors, go back to Step 1.
    ```
    Connecting to database...
    Database connected successfully.
    All tables are ready.
    Backend server is running on http://localhost:3001
    ```
2.  Once the backend is confirmed running, you can restart the frontend (right-click `index.html` > "Open with Live Server") and sign in.

---

### Other Common Issues

*   **Is MySQL Running?** Make sure your MySQL server is actually running on your computer. You can check this via your system's services panel or by trying to connect with a GUI tool like MySQL Workbench.

*   **Did You Create the Database?** Before starting the server, you must connect to MySQL and run the command: `CREATE DATABASE finance_flow;`. The server will create the *tables*, but it won't create the *database* itself.
