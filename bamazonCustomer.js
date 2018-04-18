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
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) throw error;
    console.log("****************************");
    console.log("ITEMS FOR SALE ON KABLAMAZON");
    console.log("****************************");
    for (var i = 0; i < results.length; i++) {
      console.log('\nID NUMBER: ' + results[i].id + '\nPRODUCT NAME: ' + results[i].productName + '\nDEPT NAME: ' + results[i].departmentName + '\nPRICE: $' + results[i].price + '\nQUANTITY IN STOCK: ' + results[i].stockQuantity + '\n*************');
    }
    //ask for ID of prodcut they would like to buy
    //then asks how many units of product they would like to buy
  });
}

//check to see if there is enough stockQuantity to complete request
//if not, insufficient quntity logged

//if store has enough the order is fulfilled, updating database to reflect remaining quntity
//show customer total cost of purchase after update goes through
