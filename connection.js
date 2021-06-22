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
            {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES"
            },
            {
            name: "View All Employees By Department",
            value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {
            name: "Add Employee",
            value: "ADD_EMPLOYEE"
            },
            {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE"
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
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS"
            },
            {
            name: "Add Department",
            value: "ADD_DEPARTMENT"
            },
            {
            name: "Quit",
            value: "QUIT"
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
        }
    })
}

const allEmps = () => {
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title, role.salary FROM employee INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;';
    
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log("VIEW_EMPLOYEES");
      console.table(res);  
      initQuestion();
    })
};