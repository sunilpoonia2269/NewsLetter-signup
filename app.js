const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const config = require("./config.js");

console.log(config);



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // API Variables
    const dataCenter = "us6";
    const apiKey = config.apiKey
    const listid = config.listId;
    const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listid}`;


    const options = {
        method: "POST",
        auth: apiKey,
    };

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        }, ],
    };
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));

        });

    });
    request.write(jsonData);
    request.end();

});


app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server running at PORT 3000");
});