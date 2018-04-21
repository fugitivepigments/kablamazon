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
    };
    inquirer.prompt([{
        name: 'whichProduct',
        type: 'rawlist',
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].productName);
          }
          return choiceArray;
        },
        message: 'WHICH PRODUCT WOULD YOU LIKE TO PURCHASE PLS?\n'
      },
      {
        name: 'howMany',
        type: 'input',
        message: 'PLS, HOW MANY U NEED?'
      }
    ]).then(function(answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].productName === answer.whichProduct) {
          chosenItem = results[i];
        }
      }
      //checks to see if theres enough in stock
      if (chosenItem.stockQuantity < parseInt(answer.howMany)) {
        console.log('SRY NOT ENOUGH IN STOCK, PLS CHOOSE A SMALLER QUANTITY THX.');
        initDisplay();
      } else {
        //update db to reflect new stockQuantity
        connection.query(
          "UPDATE products SET stockQuantity = ? WHERE id = ?", [
            chosenItem.stockQuantity - answer.howMany, chosenItem.id
          ],
          function(err) {
            if (err) throw err;
            totalPrice = chosenItem.price * parseInt(answer.howMany);
            console.log('LUCKED OUT! WE HAVE ALL THAT IN STOCK. YOU OWE ME $' + totalPrice + '.');
            inquirer.prompt({
              name: 'anythingElse',
              type: 'rawlist',
              message: 'ANYTHING ELSE YOUR MAJESTY?',
              choices: ['YA', 'NA']
            }).then(function(answer) {
              if (answer.anythingElse.toUpperCase() === 'YA') {
                initDisplay();
              } else {
                console.log('THANKS 4 CHECKIN OUT KABLAMAZON YO!');
              }
            });
          }
        )
      }
    });
  });
}
//check to see if there is enough stockQuantity to complete request
//if not, insufficient quntity logged

//if store has enough the order is fulfilled, updating database to reflect remaining quntity
//show customer total cost of purchase after update goes through
