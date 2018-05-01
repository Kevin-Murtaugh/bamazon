var mysql = require("mysql");
var inquirer = require("inquirer");

var stockQtyChoice = 99;
var saleAmount = 0;
var userChoicePrice = 0;
var userQty = 0;

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
connection.connect(function (err) {
    if (err) throw err;
    console.log("Hello Customer.  Welcome to Bamazon!  You are logged in today as ID# " + connection.threadId + "\n");
    console.log("Here is what we have for sale today:")
    readProducts();
});


//print inventory table
function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            console.log("err", err);
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log("-----------------------------------------------");
                console.log(" | ", res[i].id, " | ", res[i].prodName, " | ", res[i].deptName, " | ", res[i].price, " | ", res[i].stkQty, " | ");
            }
            console.log("----------------------------------------------");
            inquirer.prompt([{
                    name: "product_name",
                    type: "list",
                    message: "Which product would you like to buy? (Select 'exit' to end program.)",
                    choices: function () {
                        var choiceArray = [];
                        res.forEach(products => choiceArray.push(products.prodName));
                        choiceArray[10] = "exit";
                        return choiceArray;
                    }
                }])
                .then(function (answer) {
                    // store values globally to accommodate inquirer
                    for (var i = 0; i < res.length; i++) {
                        if (answer.product_name === "exit") {
                            bamazonExit();
                        }
                        if (res[i].prodName === answer.product_name) {
                            idChoice = i + 1;
                            userChoicePrice = res[i].price;
                            productChoice = res[i].prodName;
                            stockQtyChoice = res[i].stkQty;
                        }
                    }
                    prodQtyFn();
                });
            //         connection.end();
        };

    })
}


function prodQtyFn() {
    inquirer.prompt([{
            type: "input",
            name: "userQty",
            message: "How many would you like to buy? (Enter zero or leave blank to exit.)"
        }, ])
        .then(function (answer) {
            console.log("userQty ", userQty)
                if (parseInt(answer.userQty) > stockQtyChoice) {
                    console.log("Sorry, we don't have enough stock to complete your order.");
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    readProducts();
                    return
                } else {
                    if (answer.userQty = "" || answer.userQty <= 0) {
                        bamazonExit();
                    } else {
                        updateDB();
                    };
                };
                    saleAmount = userChoicePrice * parseInt(answer.userQty);
        });
                    function updateDB() {
                        console.log("stockQtyChoice", stockQtyChoice, "answer.userQty ", userQty);
                        connection.query(
                            "UPDATE products SET ? WHERE ?", [{
                                    stkQty: (stockQtyChoice - parseInt(userQty))
                                },
                                {
                                    id: idChoice
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                            })
                            console.log("Order placed!");
                            console.log("Total cost = " + answer.userQty + " units at $" + userChoicePrice + "= $" + saleAmount);
                            console.log("Thank you for your business!");
                            console.log(" ");
                            console.log(" ");
                            console.log(" ");
                            readProducts();
                            }
                        };

                function bamazonExit() {
                    console.log("Thank you for shopping at Bamazon.  Goodbye.");
                    connection.end();
                    process.exit();
                };