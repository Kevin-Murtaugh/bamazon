var mysql = require("mysql");
var inquirer = require("inquirer");
// var bamazonCRUD = require("bamazonCRUD");

var validInput = false;
var globalProd =[];
var product= [];


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
 //   readProducts();
    console.log("call buyChoice()");
    buyChoice();
  });

// ebay-like code from exercises
function buyChoice() {
    console.log("inside buy choice");
    // query the database for all items being auctioned
     connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

     console.log("enter inquirer fn /prompt");
     inquirer.prompt([
        {
          name: "product_name",
          type: "list",
          message: "Which product would you like to buy?",
          choices: function () {
            let choiceArray = [];
            res.forEach(product => choiceArray.push(product.product_name));
            return choiceArray;
          }
        }
      ])
      .then(function(answer) {
        // store db row for chosen product in productChoice
        res.forEach(function(product) {
          if (product.product_name === answer.product_name) {
            productChoice = product;
          }
        });


        // get user's quantity desired
        inquirer.prompt([
          {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(input) {
              // check against inventory available; if user asks for too much, prompt won't continue
              return input <= productChoice.stock_quantity || "Sorry, we don't have that many in stock. Try again!";
            }
          }
        ])
        .then(function(answer) {
          // deduct db inventory by answer.quantity (to num)
          let saleAmount = parseInt(productChoice.price) * parseInt(answer.quantity);
          let query = "UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id= ?";
          let values = [
            productChoice.stock_quantity - answer.quantity,
            productChoice.product_sales + saleAmount,
            productChoice.item_id
          ];
          console.log("saleAmount:", saleAmount, "query", query, "values", values);
          connection.query(query, values, function(err){
              if (err) throw err;
              console.log("OK, it's yours!");
              console.log("Let's see, " + answer.quantity + " units at $" + productChoice.price + "...");
              console.log("That'll be $" + saleAmount + " please.");
              runSale();
            }
          );
        });
        //end of 2nd .then
      });
    });
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
