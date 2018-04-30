var mysql = require("mysql");
var inquirer = require("inquirer");
// var bamazonCRUD = require("bamazonCRUD");

var validInput = false;
var globalProd = [];
var product = [];
var productChoice = [];
var stockQtyChoice = 99;
//var stockChoiceQty = 199;
var saleAmount = 0;
var userChoicePrice = 0;
var userQty = 1;

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username]
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Hello Customer, how are you?  You are logged in today as ID# " + connection.threadId + "\n");
    console.log("Here is what we have for sale today:")
    readProducts();
    console.log("call buyChoice()");
    buyChoice();
    //    prodChoicefn();
    prodQtyfn();
});

// ebay-like code from exercises
function readProducts() {
    console.log("read products");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            console.log("err", err);

            // Log all results of the SELECT statement
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("-----------------------------------------------");
                console.log(" | ", res[i].id, " | ", res[i].prodName, " | ", res[i].deptName, " | ", res[i].price, " | ", res[i].stkQty, " | ");
                //           console.log("holdArray", holdArray[i]);
            }
            console.log("----------------------------------------------");
            inquirer.prompt([{
                    name: "product_name",
                    type: "list",
                    message: "Which product would you like to buy?",
                    choices: function () {
                        let choiceArray = [];
                        res.forEach(products => choiceArray.push(products.prodName));
                        return choiceArray;
                    }
                }])
                .then(function (answer) {
                    // store db row for chosen product in productChoice
                    //        console.log("answer.product_name ", answer.product_name);
                    for (var i = 0; i < res.length; i++) {
                        //            console.log("res[i]", res[i]);
                        if (res[i].prodName === answer.product_name) {
                            condole.log("matched prod name!")
                            idChoice = i + 1;
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

function prodChoicefn() {
    //     inquirer.prompt([
    //         {
    //         name: "product_name",
    //         type: "list",
    //         message: "Which product would you like to buy?",
    //         choices: function () {
    //             let choiceArray = [];
    //             res.forEach(products => choiceArray.push(products.prodName));
    //             return choiceArray;
    //             }
    //         }
    //     ])
    //     .then(function(answer) {
    //         // store db row for chosen product in productChoice
    // //        console.log("answer.product_name ", answer.product_name);
    //         for (var i = 0; i < res.length; i++) {
    // //            console.log("res[i]", res[i]);
    //             if (res[i].prodName === answer.product_name) {
    //                 idChoice = i+1;
    //                 userChoicePrice = res[i].price;
    //                 productChoice = res[i].prodName;
    //                 stockQtyChoice = res[i].stkQty;
    //                 console.log("inside 1st .then", i, idChoice, userChoicePrice, productChoice, stockQtyChoice);
    //             }
    //         }
    //     });
};

function prodQtyfn() {
    inquirer.prompt([{
            message: "How many would you like to buy? (Default =1)",
            type: "list", 
            name: "userQty",
            default: 1, 
            input: function() {
        // check against inventory available; if user asks for too much, prompt won't continue
                    if (answer.userQty <= stockQtyChoice) {
                        console.log("Sorry, we cannot fulfill your order.");
                    }
            }
        }])
        .then(function () {
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
                "UPDATE products SET ? WHERE ?", [{
                        stkQty: (stockQtyChoice - answer.userQty)
                    },
                    {
                        id: idChoice
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Bid placed successfully!");
                    //              start();
                }
            );
            if (err) throw err;
            console.log("Your total price is " + answer.userQty + " units at $" + userChoicePrice + "...");
            console.log("That'll be $" + saleAmount + " please.");
            buyChoice();
        });
};
//   });


function buyChoice() {
    // fetch and display db data
    connection.query("SELECT * FROM products ORDER BY id", function (err, res) {
        if (err) throw err;
    });
};