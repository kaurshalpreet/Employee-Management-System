USE employeeDb;
-- Departments Data
INSERT INTO departments (name) VALUES 
("Finance"),
("Marketing"),
("Operations"),
("Engineering"),
("Human-resources");

-- Roles Data
INSERT INTO role (title, salary, department_id) VALUES 
("Accountant Manager", 100000, 1),
("Financial Associate", 62000, 1),
("Sales Manager", 90000, 2),
("Sales Associate", 50000, 2),
("Operations Manager", 80000, 3),
("Operations Associate", 50000, 3),
("Chief Engineer", 110000, 4),
("Engineer", 100000, 4),
("HR Manager", 80000, 5),
("HR Associate", 60000, 5);

-- Employees Data
INSERT INTO employees (first_name, last_name, role_id, manager_id, department_id) VALUES
("Jessi", "Salazar", 7, NULL, 4),
("Dave", "Wong", 5, NULL, 3),
("Art", "Silva", 8, 1, 4),
("Tanya", "Winslet", 1, NULL, 1),
("Xochitl", "Parades", 3, NULL, 2),
("Kate", "li", 6, 2, 3),
("Robin", "Sparkles", 2, 4, 1),
("Ted", "Mosbi", 4, 5, 2),
("Marshall", "Erikson", 9, NULL, 5),
("Lilly", "Kaur", 10, 9, 5)