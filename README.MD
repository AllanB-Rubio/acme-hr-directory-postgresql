# Acme HR Directory

## Overview

The Acme HR Directory is a Node.js and Express application that provides a simple API for managing employees and departments within a company. This project uses PostgreSQL as its database to store employee and department information.

## Features

- **Create**: Add new employees to the database.
- **Read**: Retrieve lists of departments and employees.
- **Update**: Update employee details.
- **Delete**: Remove employees from the database.
- **Error Handling**: Provides clear error messages for API requests.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Morgan (for logging HTTP requests)
- pg (PostgreSQL client for Node.js)

## API Endpoints

### Employees

- **Create Employee**

  - **URL**: `/api/employees`
  - **Method**: POST
  - **Body Parameters**:
    - `name` (string): The name of the employee.
    - `department_id` (integer): The ID of the department the employee belongs to.
  - **Response**: The created employee object.

- **Get Employees**

  - **URL**: `/api/employees`
  - **Method**: GET
  - **Response**: An array of employee objects.

- **Update Employee**

  - **URL**: `/api/employees/:id`
  - **Method**: PUT
  - **Body Parameters**:
    - `name` (string): The name of the employee.
    - `department_id` (integer): The ID of the department the employee belongs to.
  - **Response**: The updated employee object.

- **Delete Employee**
  - **URL**: `/api/employees/:id`
  - **Method**: DELETE
  - **Response**: HTTP 204 No Content.

### Departments

- **Get Departments**
  - **URL**: `/api/departments`
  - **Method**: GET
  - **Response**: An array of department objects.
