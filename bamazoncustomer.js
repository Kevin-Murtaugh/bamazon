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

//     //   // once you have the items, prompt the user for which they'd like to bid on
     console.log("enter inquirer fn /prompt");

    // // get user's choice of product
    inquirer.prompt([
        {
          name: "userProdName",
          type: "list",
          message: "Which product would you like to buy?",
          choices: function () {
            var userChoiceArray = [];
            res.forEach(product => userChoiceArray.push(product.prodName));
            return userChoiceArray;
          }
        }
      ])
    .then(function(answer) {
        // store db row for chosen product in productChoice
        res.forEach(function(productInStock) {
            if (productInStock.prodName === answer.userProdName) {
//                checkWhichQty =product.id;
                console.log("prodinstk.userProdName ", productInStock.userProdName, "prodinstk.id ", productInStock.id);
                globalProd = productInStock;
                console.log(globalProd);
          }
        })
    })
    });
}

inquirer.prompt([
    {
      name: "userQty",
      type: "input",
      message: "How many would you like to buy?",
      validate: function(input) {
// check against inventory available; if user asks for too much, prompt won't continue
        console.log("answer.userQty ", answer.userQty);
        if (globalProd.stkQty >= userChoiceProd) {
            console.log("sorry, we don;t have that many in stock");
        }

//        return input > userChoiceProd.stkQty || "Sorry, we don't have that many in stock. Try again!";
      }
    }
  ])
  .then(function(answer) {
    // deduct db inventory by answer.quantity (to num)
    var saleAmount = parseInt(userProdChoice.price) * parseInt(answer.userQty);
    var query = "UPDATE products SET stock_quantity=?, WHERE item_id= ?";
    var values = [
      userProdChoice.stkQty - answer.userQty,
      userProdChoice.item_id
    ];
console.log("saleAmount:", saleAmount, "query", query, "values", values);
  });

// inquirer mess starts here 
//    var idChoice =0;
//    var idQty = 0;

// // inquirer.prompt ([
//     {   name: "IDchoice",
//         type: "input", 
//         message: "Which item would you like to buy?",
//     },   
//     {   
//         name: "orderQty",
//         type: "input",
//         message: "How many would you like to buy?"  
//     }
//     validate: function(answer) {

//     }
//     ])
//     .then(function(answer) {
//     // get the information of the chosen item
//         if (res[idChoice].stkQty < orderQty) {
//                 console.log("2nd if stmt under chos eItem  promise");
//                 res[idChoice].stkQty -= orderQty * res[idchoice].price;
//                 console.log("Your total cost = $", orderQty,".");
//                 console.log("Thank you for your business!");
//         } else {
//             console.log("Sorry, we do not have enough stock to fill your order.")
//         };
//     });
    

    // var questions =[];
    //     {
    //         message: "Which item would you like to buy?",
    //         type: "input",
    //         name: "idChoice"
    //     },
    //     {
    //         message: "How many would you like to buy?",
    //         type: "input", 
    //         name: "idQty"    
    //     }];
    // function itemReq(idChoice){
    //     console.log("inside itemReq");
    // //     }
    //         inquirer.prompt ([
    //         {
    //             message: "Which item would you like to buy?",
    //             type: "input",
    //             name: "idChoice"
    //         },
    //         {
    //             message: "How many would you like to buy?",
    //             type: "input", 
    //             name: "idQty"    
    //         }]
    //         .then(function(answer) {        
    //             console.log("after .then",answer.idChoice, answer.idQty);

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
