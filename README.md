# 📄 CSV to JSON Converter API

This project is a **CSV to JSON Converter API** built using **Node.js, Express, and PostgreSQL**.
It reads a CSV file from a configurable path, converts it into JSON (without using any CSV parser libraries), and uploads the records into a PostgreSQL database.
It also provides an **age distribution report** for all users.

---

## Features

* Custom CSV parsing logic (no external CSV-to-JSON libraries)
* Configurable file path via `.env`
* Inserts data into PostgreSQL in efficient batches
* Calculates and prints **Age Distribution Report**
* REST API endpoints for health check, upload, and report
* Clean modular project structure

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Sakshie-patil/csv-to-json_assignment.git
cd csv-to-json_assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create PostgreSQL database

```bash
psql -U sakshi
CREATE DATABASE csv_json;
\c csv_json
\i schema.sql
```

### 4. Configure environment

Create a `.env` file in the project root:

```bash
DB_USER=sakshi
DB_PASS=
DB_NAME=csv_json
DB_HOST=localhost
DB_PORT=5432
CSV_FILE_PATH=./data/users.csv
PORT=3000
```

---

## 5. Run the Application

```bash
npm start
```

The server will start at:

```
http://localhost:3000
```

---

##  API Endpoints

### 🩺 Health Check

**GET** `/health`
Response:

```json
{ "status": "ok" }
```

###  Upload CSV and Insert into DB

**POST** `/upload-csv`
Reads CSV from `CSV_FILE_PATH`, parses it, and inserts into DB.
Response:

```json
{ "success": true, "message": "4 records inserted" }
```

After upload, the app also logs the **Age Distribution Report** on the console.

###  Age Distribution Report

**GET** `/age-distribution`
Response:

```json
{
  "<20": "23.08%",
  "20-40": "53.85%",
  "40-60": "23.08%",
  ">60": "0.00%"
}
```

---

## 🗃️ Database Schema

```sql
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INT NOT NULL,
    address JSONB,
    additional_info JSONB
);
```

---

## 🧮 Age Group Calculation Logic

| Age Group | Range              | Example |
| --------- | ------------------ | ------- |
| `<20`     | Less than 20 years | 15, 19  |
| `20-40`   | 20 to 40 years     | 25, 38  |
| `40-60`   | 41 to 60 years     | 55      |
| `>60`     | Above 60 years     | 70      |

---

##  Assumptions

* The first line of CSV is always headers.
* CSV files may contain nested properties using dot notation.
* Complex fields are stored in JSONB columns.
* Additional properties go into `additional_info`.

---

