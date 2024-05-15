// import express and pg
const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_directory_db"
);

const port = process.env.PORT || 3000;

// app routes here
app.use(express.json());
app.use(require("morgan")("dev"));
// Error-handling
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error to the console
  res.status(500).json({ error: err.message }); // Send a JSON response with the error message
});

// CREATE // POST // INSERT
app.post("/api/employees", async (req, res, next) => {
  try {
    const SQL = `
    INSERT INTO employee (name, department_id)
    VALUES($1, $2)
    RETURNING *
    `;

    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//READ // GET // Departments
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * FROM department`;

    const response = await client.query(SQL);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

//READ // GET // Employees
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `SELECT * from employee ORDER BY created_at DESC;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

//UPDATE // PUT // SET
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = `
        UPDATE employee
        SET name=$1, department_id=$2, updated_at=now()
        WHERE id=$3 RETURNING *`;

    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});
//DELETE
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = `
        DELETE from employee
        WHERE id = $1`;

    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// create your init function
const init = async () => {
  await client.connect();
  console.log("connected to database");

  let SQL = `
    DROP TABLE IF EXISTS employee;
    DROP TABLE IF EXISTS department;

    CREATE TABLE department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    CREATE TABLE employee (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        department_id INTEGER REFERENCES department(id) NOT NULL
      );

      INSERT INTO department(name) VALUES('IT');
      INSERT INTO department(name) VALUES('Human Resources');
      INSERT INTO department(name) VALUES('Accounting and Finance');
      INSERT INTO department(name) VALUES('Research and Development');

      INSERT INTO employee(name, department_id) 
      VALUES('Tom', (SELECT id FROM department WHERE name='Research and Development'));

      INSERT INTO employee(name, department_id) 
      VALUES('Alice', (SELECT id FROM department WHERE name='IT'));

      INSERT INTO employee(name, department_id) 
      VALUES('Bob', (SELECT id FROM department WHERE name='Human Resources'));

      INSERT INTO employee(name, department_id) 
      VALUES('Eve', (SELECT id FROM department WHERE name='Accounting and Finance'));

      INSERT INTO employee(name, department_id) 
      VALUES('Charlie', (SELECT id FROM department WHERE name='Research and Development'));

      INSERT INTO employee(name, department_id) 
      VALUES('Dave', (SELECT id FROM department WHERE name='IT'));

      INSERT INTO employee(name, department_id) 
      VALUES('Grace', (SELECT id FROM department WHERE name='Human Resources'));

      INSERT INTO employee(name, department_id) 
      VALUES('Mallory', (SELECT id FROM department WHERE name='Accounting and Finance'));

      INSERT INTO employee(name, department_id) 
      VALUES('Oscar', (SELECT id FROM department WHERE name='Research and Development'));

      INSERT INTO employee(name, department_id) 
      VALUES('Peggy', (SELECT id FROM department WHERE name='IT'));

  `;

  await client.query(SQL);
  console.log("data seeded");

  app.listen(port, () => console.log(`server listening on port ${port}`));
};

// init function invocation
init();
