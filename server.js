var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var figlet = require('figlet');

//code from figlet module to display a drawing of employee tracker before first prompt
figlet('EMPLOYEE MANAGER', function(err, data) {
  if (err) throw err;
console.log(data)
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Champion123#",
  database: "employeeDb"
});

connection.connect(function(err) {
    if (err) throw err;
    startApp();
  });
 
//Function that starts the app and prompt the questions
function startApp() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees By Manager",
        "View departments",
        "View roles",
        "Add department",
        "Add role",
        "Add Employee",
        "Remove Employee",
        "Remove Department",
        "Remove Role",
        "Update Employee Role",
        "Update Employee Manager",
        "View total utilized budget by department",
        "EXIT"
      ],
      name: "action"
    })
.then(function(answer) {
    switch (answer.action) {
    case "View All Employees":
      viewEmployees();
      break;

    case "View Employees By Manager":
      viewEmployeesByMngr();
      break;

    case "View departments":
      viewDept();
      break;
    
    case "View roles":
      viewRoles();
      break;

    case "Add Employee":
      addEmployee();
      break;
  
    case "Add department":
      addDept();
      break;
    
    case "Add role":
      addRole();
      break;

    case "Remove Employee":
      removeEmployee();
      break;
    
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    
    case "Update Employee Manager":
      updateEmployeeMng();
      break;
    
    case "Remove Department":
      removeDepartment();
      break;
    
    case "Remove Role":
      removeRole();
      break;

    case "View total utilized budget by department":
      viewBudget();
      break;


    case "EXIT":
      console.log("Thanks for using Employee Tracker! Have a nice day!")
      process.exit();
    }
  });
}

//Function view all employees
function viewEmployees() {
    var query = `SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id 
    LEFT JOIN departments on role.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;
    connection.query(query, function(err, query){
        console.table(query);
        startApp();
    });
};

//Function view all employees by Manager
function viewEmployeesByMngr() {
    var query =`SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, departments.name AS department,employees.first_name, employees.last_name, role.title FROM employees 
    LEFT JOIN role on employees.role_id = role.id 
    LEFT JOIN departments departments on role.department_id = departments.id 
    LEFT JOIN employees manager on manager.id = employees.manager_id WHERE employees.manager_id`;
    connection.query(query, function(err, query){
      console.table(query);
      startApp();
  });
};

//Function to view all departments
function viewDept() {
  var query = `select id AS Dept_ID, name AS departments from departments;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};

//Function to view all roles
function viewRoles() {
  var query = `select id AS Role_ID, title, salary AS Salaries from role;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};

//Function to add a new employee
function addEmployee() {
  //arrays to display prompt choices from database items 
  var roleChoice = [];
  connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      var roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    var deptChoice = [];
    connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        var deptList = resDept[i].name;
        deptChoice.push(deptList);
    }
    
  inquirer
    .prompt([
    {
      type: "input",
      message: "Enter employee's first name:",
      name: "firstName"
    },
    {
      type: "input",
      message: "Enter employee's last name:",
      name: "lastName"
    },
    {
      type: "rawlist",
      message: "Select employee role:",
      choices: roleChoice,
      name: "role_id"
    },
    {
      type: "rawlist",
      message: "Select employee's department:",
      choices: deptChoice,
      name: "department_id"
    },
  ])
    .then(function(answer) {
      //for loop to retun 
      var chosenRole;
        for (var i = 0; i < resRole.length; i++) {
          if (resRole[i].title === answer.role_id) {
            chosenRole = resRole[i];
          }
        };

        var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };
      //connection to insert response into database  
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: chosenRole.id,
          department_id: chosenDept.id
        },
        function(err) {
          if (err) throw err;
          console.log("Employee " + answer.firstName + " " + answer.lastName + " successfully added!");
          startApp();
        }
      );
    })
   });
  })
};

//Function to add department
function addDept() {
  inquirer
    .prompt([
    {
      type: "input",
      message: "Enter new department's name:",
      name: "dept"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO departments SET ?",
      {
        name: answer.dept
      },
      function(err) {
        if (err) throw err;
        console.log("Department " + answer.dept + " successfully added!");
        startApp();
      }
    );
  });
};

//Function to new add role
function addRole() {
  var deptChoice = [];
    connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        var deptList = resDept[i].name;
        deptChoice.push(deptList);
    }

  inquirer
  .prompt([
  {
    type: "input",
    message: "Enter new role's name:",
    name: "title"
  },
  {
    type: "number",
    message: "Enter new role's salary:",
    name: "salary"
  },
  {
    type: "rawlist",
    message: "Select employee's department:",
    choices: deptChoice,
    name: "department_id"
  }
])
.then(function(answer) {

  var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };

  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: chosenDept.id
    },
    function(err) {
      if (err) throw err;
      console.log("New role " + answer.title + " successfully added!");
      startApp();
    }
  );
});
})
};

//Function to remove employee
function removeEmployee() {
  var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        var empList = resEmp[i].name;
        empChoice.push(empList);
    };

  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "Select the employee you would like to remove:",
        choices: empChoice,
        name: "employee_id"
      },
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

    connection.query(
      "DELETE FROM employees WHERE id=?",
      [chosenEmp.id],

      function(err) {
        if (err) throw err;
        console.log("Employee successfully removed!");
        startApp();
      }
    );
   });
  })
};

// Function to remove department
  function removeDepartment() {
    var deptChoice = [];
    connection.query("SELECT name AS department FROM departments", function (err, resDept) {
    if (err) throw err;
    for (var i = 0; i < resDept.length; i++) {
      var deptList = resDept[i].department;
      deptChoice.push(deptList);
    };
    
    inquirer
    .prompt([
      {
        type: "rawlist",
        message: "Select the department you would like to remove:",
        choices: deptChoice,
        name: "department_name"
      },
  ])
  .then(function(answer) {

    var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].department === answer.department_name) {
            chosenDept = resDept[i];
        }
      };

    connection.query(
      "DELETE FROM departments WHERE name=?",
      [chosenDept.department],

      function(err) {
        if (err) throw err;
        console.log("Department successfully removed!");
        startApp();
      }
    );
   });
  });
};

//Function to update employee role
function updateEmployeeRole() {
  var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        var empList = resEmp[i].name;
        empChoice.push(empList);
    };
    
    var roleChoice = [];
  connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      var roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    inquirer
    .prompt([
    {
      type: "rawlist",
      message: "Select the employee you would like to update:",
      choices: empChoice,
      name: "employee_id"
    },
    {
      type: "rawlist",
      message: "Select employee's new role:",
      choices: roleChoice,
      name: "role_id"
    }
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

    var chosenRole;
      for (var i = 0; i < resRole.length; i++) {
        if (resRole[i].title === answer.role_id) {
          chosenRole = resRole[i];
        }
      };
      connection.query(
        "UPDATE employees SET role_id = ? WHERE id = ?",
        [chosenRole.id, chosenEmp.id],
        function(err) {
          if (err) throw err;
          console.log("Employee new role successfully updated!");
          startApp();
        }
      );
    })
   })
  })
};

//Function to update employee manager
function updateEmployeeMng() {
  var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        var empList = resEmp[i].name;
        empChoice.push(empList);
    };

    inquirer
    .prompt([
    {
      type: "rawlist",
      message: "Select employee you would like to update manager:",
      choices: empChoice,
      name:"employees"
    },
    {
      type: "rawlist",
      message: "Select Manager among employees:",
      choices: empChoice,
      name: "Managerid"
    }
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employees) {
            chosenEmp = resEmp[i];
        }
      };
      var chosenManager;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.Managerid) {
            chosenManager = resEmp[i];
        }
      };
      connection.query(
        "UPDATE employees SET manager_id = ? WHERE id = ?",

        [chosenManager.id, chosenEmp.id],
        function(err) {
          if (err) throw err;
          console.log("Employee Manager successfully updated!");
          startApp();
        }
      );
    })
   })
};