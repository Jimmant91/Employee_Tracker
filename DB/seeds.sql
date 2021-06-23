USE employee_DB;

INSERT INTO department (dept_name)
VALUES ("Forensics"), ("Engineering"), ("Legal"), ("Investigations");

INSERT INTO role (title, salary, department_id)
VALUES  ('DNA Analyst', 100000, 1), ('Toxicologist', 95000, 1),
('Lead Engineer', 150000, 2), ('Software Engineer', 90000, 2),
('Chief Legal Officer', 200000, 3), ('Lawyer', 100000, 3),
('Special Agent', 175000, 4), ('Junior Fraud Investigator', 40000, 4); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Big', 'Boss', 1, 1),
        ('Solid', 'Snake', 2, 1),
        ('Loki', 'Laufeyson', 4, NULL),
        ('Thomas', 'Tankengine', 2, 3),
        ('Victor', 'Von Doom', 4, NULL),
        ('Johnny', 'Bravo', 3, 4),
        ('Finn', 'the Human', 7, NULL),
        ('Jake', 'the Dog', 8, NULL),
        ('Rick', 'Sanchez', 3, 2),
        ('Morty', 'Smith', 1, 2);