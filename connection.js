// Requiring packages
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');

// Connect to MySQL Database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'yourRootPassword',
        database: 'employee_DB',
    }
);

connection.connect((err) => {
    if (err) throw err;
    initQuestion();
});

//////////////////////////////////////////////////////////////////////////////

// Initial prompt
const initQuestion = () => {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'initQuestion',
        choices: [
            // Wanting to arrange these in the most sensical order
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            
            // { // Extra Credit
            //   name: "View All Employees By Manager",
            //   value: "VIEW_EMPLOYEES_BY_MANAGER"
            // },
            // { // Extra Credit
            //   name: "Remove Employee",
            //   value: "REMOVE_EMPLOYEE"
            // },
            // { // Extra Credit
            //   name: "Update Employee Manager",
            //   value: "UPDATE_EMPLOYEE_MANAGER"
            // },
            // { //Extra Credit
            //   name: "Remove Role",
            //   value: "REMOVE_ROLE"
            // },
            // { //Extra Credit
            //   name: "Remove Department",
            //   value: "REMOVE_DEPARTMENT"
            // },

            {
            name: "Quit",
            value: "QUIT"
            },
        ],

    }])
    
    .then((answer) => {
        switch (answer.initQuestion) {
            case 'VIEW_EMPLOYEES':
                allEmps();
                break;

            case 'VIEW_DEPARTMENTS':
                allDept();
                break;

            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                allEmpDept();
                break;

            case 'QUIT':
                connection.end();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    })
}

// Calling all functions for my switch
const allEmps = () => {
    // Want to shorten this query as much as possible
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title, dept_name AS Department, role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role ON e.role_id = role.id JOIN department ON department.id = role.department_id ORDER BY e.id";
    
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log("VIEW_EMPLOYEES");
      console.table(res);  
      initQuestion();
    })
};

const allDept = () => {
    const query = "SELECT department.dept_name AS Department FROM department ORDER by department.id";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("VIEW_DEPARTMENTS");
        console.table(res);
        initQuestion();
    })
};

const allEmployDep = () => {
    // Want to shorten this query as much as possible
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title, dept_name AS Department, role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role ON e.role_id = role.id JOIN department ON department.id = role.department_id ORDER BY dept_name ASC";
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("VIEW_EMPLOYEES_BY_DEPARTMENT");
        console.table(res);  
        start();
    })
};
