// Requiring packages
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');
const util = require('util');
const { allowedNodeEnvironmentFlags } = require('process');

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

const query = util.promisify(connection.query).bind(connection);

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
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
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

            case 'ADD_EMPLOYEE':
                addEmp();
                break;

            case 'VIEW_DEPARTMENTS':
                allDept();
                break;

            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                allEmpDept();
                break;

            case 'ADD_DEPARTMENT':
                addDept();
                break;

            case 'REMOVE_DEPARTMENT':
                removeDept();
                break;

            case 'VIEW_ROLES':
                allRoles();
                break;

            case 'ADD_ROLE':
                addRole();
                break;

            case 'UPDATE_EMPLOYEE_ROLE':
                updateRole();
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

const addEmp = async () => {
    // Awaiting the role to be selected at end of the following prompts
    const roles = await query(`SELECT * FROM role`);
    const roleChoice = roles.map((choice) => ({
        name: choice.title,
        value: choice.id,
    }));

    const answer = await inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager's ID?",
        },
        {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: roleChoice,
        }
    ]);

    const empInfo = "INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?,?,?,?)";
    let answers = [
        answer.first_name,
        answer.last_name,
        answer.manager_id,
        answer.role_id,
    ]
    const res = await query(empInfo, answers);
    console.table(res);
    initQuestion();
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

const allEmpDept = () => {
    // Want to shorten this query as much as possible
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title, dept_name AS Department, role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role ON e.role_id = role.id JOIN department ON department.id = role.department_id ORDER BY dept_name ASC";
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("VIEW_EMPLOYEES_BY_DEPARTMENT");
        console.table(res);  
        initQuestion();
    })
};

const addDept = async () => {
    const answer = await inquirer.prompt([
        {
            name: "dept_name",
            type: "input",
            message: "Provide the name of the department you would like to add:",
        }
    ]);

    const insert = "INSERT INTO department (dept_name) VALUES (?);";
    const deptInfo = [answer.dept_name];
    const res = await query(insert, deptInfo);
    console.table(res);
    initQuestion();
}

// Global delete function
const deleteFromTable = async (table, idColumn, idToDelete) => {
    const params = [table, idColumn, idToDelete];
    const res = await query(`DELETE FROM ?? WHERE ?? = ?`, params);
    // console.log(params);
    console.table(res);
    initQuestion();
  };

const removeDept = async () => {
    const departments = await query(`SELECT * FROM department`);
    const departmentChoice = departments.map((choice) => ({
      name: choice.dept_name,
      value: choice.id,
    }));
  
    const answer = await inquirer.prompt([
        {
            name: "department_id",
            type: "list",
            message: "Which department would you like to delete?",
            choices: departmentChoice,
        },
    ]);
  
    deleteFromTable("department", "id", answer.department_id);
};

const allRoles = () => {
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, role.title AS Title, dept_name AS Department, role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role ON e.role_id = role.id JOIN department ON department.id = role.department_id ORDER BY role.title ASC";
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("VIEW_ROLES");
        console.table(res);  
        initQuestion();
    });
};

const addRole = async () => {
    const depts = await query('SELECT * FROM department;');
    const deptChoice = depts.map((choice) => ({
        name: choice.dept_name,
        value: choice.id,
    }));

    const answer = await inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is role you would like to add?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?",
        },
        {
            name: "dept_name",
            type: "list",
            message: "What is the corresponding department?",
            choices: deptChoice
        }
    ]);

    const roleInfo = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
    let answers = [
        answer.title,
        answer.salary,
        answer.dept_name,
    ]
    const res = await query(roleInfo, answers);
    console.table(res);
    initQuestion();
}

const updateRole = async () => {
    const roles = await query("SELECT * FROM role;");
    const roleChoice = roles.map((choice) => ({
        name: choice.title,
        value: choice.id,
    }));

    const answer = await inquirer.prompt([
        {
            name: "role_id",
            type: "list",
            message: "Which role would you like to update?",
            choices: roleChoice,
        },
        {
            name: "title",
            type: "input",
            message: "What would you like to rename the role to?"
        },
    ]);

    const roleInfo = "UPDATE role SET title=? WHERE id=?;";
    const answers = [answer.title, answer.role_id];

    const res = await query(roleInfo, answers);
    console.table(res);
    initQuestion();
};