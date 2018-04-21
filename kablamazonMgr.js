var inquirer = require('inquirer');
var mysql = require('mysql');

// Setup connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "kablamazon"
});

var chosenItem;
var totalPrice;
var buys = [];
var updatedStockQty;

//connects to sql database and lets us know if it failed or not
connection.connect(function(err) {
  if (err) throw err;
  console.log('We are deeply connected...to the server.');
  mgrOption();
});

function mgrOption() {
  inquirer.prompt([{
    name: 'mgrOptions',
    type: 'rawlist',
    choices: ['VIEW PRODUCTS', 'VIEW LOW INV', 'ADD TO INV', 'ADD NEW PRODUCT'],
    message: 'WHAT YOU WANNA DO BOSS?'
  }]).then(function(answer) {
    if (answer.mgrOptions.toUpperCase() === 'VIEW PRODUCTS') {
      viewProducts();
    } else if (answer.mgrOptions.toUpperCase() === 'VIEW LOW INV') {
      viewLowInv();
    } else if (answer.mgrOptions.toUpperCase() === 'ADD TO INV') {
      addToInv();
    } else if (answer.mgrOptions.toUpperCase() === 'ADD NEW PRODUCT') {
      addProduct();
    }
  });
}

//shows products for sale
function viewProducts() {
  connection.query("SELECT * FROM products", function(err, results) {
    for (var i = 0; i < results.length; i++) {
      console.log('\nPRODUCT ID: ' + results[i].id + '\nPRODUCT NAME: ' + results[i].productName + '\nDEPT NAME: ' + results[i].departmentName + '\nPRICE: $' + results[i].price + '\nQUANTITY IN STOCK: ' + results[i].stockQuantity + '\n*************');
    }
    mgrOption();
  })
};

//allow mgr to update inventory of current item
function viewLowInv() {
  inquirer.prompt([{
      name: 'product',
      type: 'input',
      message: 'WHAT ITEM U NEED TO UPDATE BOSS?'
    },
    {
      name: 'amount',
      type: 'input',
      message: 'HOW MANY U ADDING BOSS?'
    }
  ]).then(function(answer) {
    connection.query("UPDATE products SET ? WHERE ?", [{
          stockQuantity: answer.amount
        },
        {
          productName: answer.product
        }
      ],
      function(err) {
        if (err) throw err;
        console.log('INVENTORY NOW UPDATED CAPN!');
        mgrOption();
      });
  });
}
//add product to inv function
function addToInv() {
  inquirer.prompt([{
      name: 'item',
      type: 'input',
      message: 'WHAT DE NAME OF DE PRODUCT BOSS?'
    },
    {
      name: 'dept',
      type: 'input',
      choices: ['Conservation Materials', 'Therapy Dolls', 'Delicious Drinks', 'Random Music', 'Dental', 'Lonely Silverware', 'Comfort Wear', 'Footwear', 'E-Waste'],
      message: 'WHICH DEPT DE PRODUCT BELONG TO?'
    },
    {
      name: 'price',
      type: 'input',
      message: 'HOW MUCH IT COSTS BOSS?'
    },
    {
      name: 'amount',
      type: 'input',
      message: 'HOW MANY U NEED TO ADD BOSS?'
    }
  ]).then(function(answer) {
    connection.query("INSERT INTO products SET ?", {
        productName: answer.item,
        departmentName: answer.dept,
        price: answer.price,
        stockQuantity: answer.amount
      },
      function(err) {
        if (err) throw err;
        console.log('ADDED PRODUCT TO THE INVENTORY CAPTAIN');
        mgrOption();
      });
  });
};
