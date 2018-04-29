var mysql = require("mysql");
var inquirer = require("inquirer");
// var bamazonCRUD = require("bamazonCRUD");

var validInput = false;
var globalProd =[];
var product= [];
var productChoice = [];
var stockQtyChoice = 99;
var saleAmount= 0;
var userChoicePrice = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
  
    // Your username]
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });

  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Hello Customer, how are you?  You are logged in today as ID# " + connection.threadId + "\n");
    console.log("Here is what we have for sale today:")
    readProducts();
    console.log("call buyChoice()");
    buyChoice();
  });

// ebay-like code from exercises
function buyChoice() {
    // fetch and display db data
    connection.query("SELECT * FROM products ORDER BY id", function (err, res) {
        if (err) throw err;

    inquirer.prompt([
        {
        name: "product_name",
        type: "list",
        message: "Which product would you like to buy?",
        choices: function () {
            let choiceArray = [];
            res.forEach(products => choiceArray.push(products.prodName));
            return choiceArray;
            }
        }
    ])
    .then(function(answer) {
        // store db row for chosen product in productChoice
//        console.log("answer.product_name ", answer.product_name);
        for (var i = 0; i < res.length; i++) {
//            console.log("res[i]", res[i]);
            if (res[i].prodName === answer.product_name) {
                idChoice = i+1;
                userChoicePrice = res[i].price;
                productChoice = res[i].prodName;
                stockQtyChoice = res[i].stkQty;
                console.log("inside 1st .then", i, idChoice, userChoicePrice, productChoice, stockQtyChoice);
            }
        }
    });

 //       get user's quantity desired
        inquirer.prompt([
          {
            name: "userQty",
            type: "input",
            default: 1,
            message: "How many would you like to buy?", // Up to ", stockQtyChoice, " available."
            validate: function(userQty) {                
                if (userQty <= stockQtyChoice) {
                    console.log( "answer.userQty ", answer.userQty, "userQty", userQty, "stockQtyChoice ", stockQtyChoice); 
                    stockChoiceQty -= userQty;
                } else {
                    return "Sorry, we do not have enough stock to satisfy your order.";
                }
          //  validate: function(input) {
            //   // check against inventory available; if user asks for too much, prompt won't continue
//            return input <= productChoice.stkQty || "Sorry, we don't have that many in stock. Try again!";
            }
        }
        ])
        .then(function(answer) {
            console.log("in 2nd .then", idChoice, userChoicePrice, productChoice, stockQtyChoice);
          // deduct db inventory by answer.quantity (to num)
          
//           stockQtyChoice -= answer.userQty;
            var saleAmount = userChoicePrice * answer.userQty;
//           var query = "UPDATE products SET stkQty= ?, WHERE id= ?";
//           var values = [
//             stockQtyChoice,
//  //           productChoice.product_sales + saleAmount,
//             idChoice
//           ];
//           console.log("saleAmount:", saleAmount, "query", query, "values", values);
//           connection.query(query, values, function(err){
            connection.query(
                "UPDATE products SET ? WHERE ?",
            [
              {
                stkQty: (stockQtyChoice - answer.userQty)
              },
              {
                id: idChoice
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
//              start();
            }
          );
              if (err) throw err;
              console.log("OK, it's yours!");
              console.log("Let's see, " + answer.userQty + " units at $" + userChoicePrice + "...");
              console.log("That'll be $" + saleAmount + " please.");
              buyChoice();
            }
          );
 //       });
    });
  }

  function readProducts() {
    console.log("read products");
   connection.query("SELECT * FROM products", function(err, res) {
      if (err) {
          console.log("err", err);
  
      // Log all results of the SELECT statement
      } else {
          for (var i=0; i < res.length; i++){
            console.log("-----------------------------------------------");
            console.log(" | ", res[i].id," | ", res[i].prodName," | ", res[i].deptName, " | ", res[i].price, " | ",  res[i].stkQty, " | ");
 //           console.log("holdArray", holdArray[i]);
          }
          console.log("----------------------------------------------");
 //         connection.end();
      };

    })
}

//                 if (validate(answer.idChoice)=== false) {
//           // determine if there are enough units
//                     console.log("Please enter a valid Product ID#.");
//                     if (parseInt(answer.idQty) > res[answer.idChoice].stkQty) {
//             // if enough, update db, let the user know & move forward
//                         console.log("Sorry, we don't have enough stock to fill your order.");
//                     } else {
//                         connection.query(
//                         "UPDATE products SET ? WHERE ?",
//                         [
//                         {
//                             stkQty: stkQty -chosenItem.qty                
//                         },
//                         { 
//                             id: answer.idChoice
//                         } 
//                     ],
//                             function(error) {
//                                 if (error) throw err;
//                                     console.log("Order placed successfully!");
// //                  start();
//                             }       
//                     );
//                 }
//                 } else {
//             // bid wasn't high enough, so apologize and start over
//                     console.log("Sorry, we don't have enough inventory. Try again...");
// //            start();
//                 };
//     });
