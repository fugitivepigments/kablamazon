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

connection.connect(function(err) {
  if (err) throw err;

  initDisplay();
});
//initial display to show all items for sale
function initDisplay() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log("****************************");
    console.log("ITEMS FOR SALE ON KABLAMAZON");
    console.log("****************************");
    for (var i = 0; i < results.length; i++) {
      console.log('\nPRODUCT ID: ' + results[i].id + '\nPRODUCT NAME: ' + results[i].productName + '\nDEPT NAME: ' + results[i].departmentName + '\nPRICE: $' + results[i].price + '\nQUANTITY IN STOCK: ' + results[i].stockQuantity + '\n*************');
    }

    inquirer.prompt([{
      name: 'choice',
      type: 'input',
      message: 'Which product would you like to purchase? \nPlease enter the ID number.'
    }]).then(function(answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].id === answer.choice) {
          chosenItem = results[i].id;
        }
      }
      if (chosenItem != results[i].id) {
        console.log('THAT IS NOT AN ITEM WE SELL. PLEASE TRY AGAIN.');
      }

      inquirer.prompt([{
        name: 'howMany',
        type: 'input',
        message: 'How many units would you like to buy?'
      }]).then(function(answer) {
        var howMany = answer.choice;
        if (chosenItem.stockQuantity >= howMany) {
          connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stockQuantity: stockQuantity - howMany
              },
              {
                id: chosenItem.id
              }
            ]
          )
        } else {
          console.log('SORRY, ITEM OUT OF STOCK. PLEASE SELECT ANOTHER.');
        }
      })

    })
  });
}

//check to see if there is enough stockQuantity to complete request
//if not, insufficient quntity logged

//if store has enough the order is fulfilled, updating database to reflect remaining quntity
//show customer total cost of purchase after update goes through
