var mysql = require("mysql");
var inquirer = require("inquirer");

var stockQtyChoice = 99;
var saleAmount= 0;
var userChoicePrice = 0;
var userQty = 5;

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
  
    // Your username]
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });

// function governAll() {  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Hello Customer, how are you?  You are logged in today as ID# " + connection.threadId + "\n");
    console.log("Here is what we have for sale today:")
    readProducts();
//    console.log("call buyChoice()");
//    buyChoice();
//    prodChoicefn();
//    prodQtyFn();
//    connection.end();
  });
// };
  

//print inventory table
  function readProducts() {
   connection.query("SELECT * FROM products", function(err, res) {
      if (err) {
          console.log("err", err);
      } else {
          for (var i=0; i < res.length; i++){
            console.log("-----------------------------------------------");
            console.log(" | ", res[i].id," | ", res[i].prodName," | ", res[i].deptName, " | ", res[i].price, " | ",  res[i].stkQty, " | ");
          }
          console.log("----------------------------------------------");
        inquirer.prompt([
        {
        name: "product_name",
        type: "list",
        message: "Which product would you like to buy?",
        choices: function () {
            let choiceArray = [];
            res.forEach(products => choiceArray.push(products.prodName));
            choiceArray[10] = "quit";
            return choiceArray;
            }
        }
    ])
    .then(function(answer) {
        prodQtyFn();
        // store values globally to accommodate inquirer
        for (var i = 0; i < res.length; i++) {
//            console.log("res[i]", res[i]);
            if (answer.product_name === "quit") {
                console.log("Thank you for shopping at Bamazon.  Goodbye.");
                connection.end();
                process.exit();
            }
            if (res[i].prodName === answer.product_name) {
                idChoice = i+1;
                userChoicePrice = res[i].price;
                productChoice = res[i].prodName;
                stockQtyChoice = res[i].stkQty;
                console.log("inside 1st .then", i, idChoice, userChoicePrice, productChoice, stockQtyChoice);
            }
        }
    });
 //         connection.end();
      };

    })
}


function prodQtyFn() {
        inquirer.prompt([
          {
            type: "input",
            name: "userQty",
            message: "How many would you like to buy?"
          }, 
        ])
        .then(function(answer) {
            console.log(answer, "in 2nd .then: userQty", userQty, "idChoice", idChoice, "userChoicePrice", userChoicePrice);
            if (userQty > stockQtyChoice) {
                console.log("Sorry, we don't have enough stock to complete your order.");
                return
            } else {
                updateDB();
            }
            saleAmount = userChoicePrice * userQty;

    function updateDB() {
        console.log("stockQtyChoice", stockQtyChoice, "UserQty ", userQty);
            connection.query(
                "UPDATE products SET ? WHERE ?",
            [
              {
                stkQty: (stockQtyChoice - userQty)
              },
              {
                id: idChoice
              }
            ],
            function(err) {
              if (err) throw err;
            console.log("Order placed!");
          console.log("Total cost = " + userQty + " units at $" + userChoicePrice + "= $" + saleAmount);
          console.log("Would you like to continue?");
          

          readProducts();
          
    
 //         governAll();
            }
          )};
              
            }
          );
        };
 //   });


// function buyChoice() {
//     // fetch and display db data
//     connection.query("SELECT * FROM products ORDER BY id", function (err, res) {
//         if (err) throw err;
//     });
//   };