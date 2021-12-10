const express = require("express");
const app = express();

let mongoose = require("mongoose");

let session = require('express-session');
const {httpOnly} = require("express-session/session/cookie");


mongoose.connect("mongodb+srv://user:correcthorsebatterystaple@cluster0.5bnhm.mongodb.net/musicStore?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("MongoDB connection error: " + err);
    } else {
        console.log("Connected to MongoDB");
    }
});

let musicSchema = mongoose.Schema({
    "MusicId": Number,
    "MusicName": String,
    "Category": String,
    "Composer": String,
    "Description": String,
    "Price": Number,
    "Published": String,
    "NewArrival": Boolean
});

let userSchema = mongoose.Schema({
    "UserName": String,
    "Password": String
});

let cartSchema = mongoose.Schema({
    "UserName": String,
    "cart": [
        {
            "MusicId": Number,
            "Quantity": Number
        }
    ]
});

let musicData = mongoose.model("music", musicSchema);

let userData = mongoose.model("user", userSchema);

let cartData = mongoose.model("cart", cartSchema);


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("static"));
app.use(session({secret: "nobody expects the spanish inquisition"}));

app.set("view engine", "pug");
app.set("views", "./views");


app.get("/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    res.render("index.pug", {login: req.session.login});
});

app.get("/login/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    res.render("login.pug", {login: req.session.login});
});

app.post("/login/", (req, res) => {
    if (req.session.login) {
        res.redirect("/");
    } else {
        userData.find({"UserName": req.body.username, "Password": req.body.password}, (err, data) => {
            if (data.length) {
                req.session.login = req.body.username;
                res.redirect("/");
            } else {
                res.render("login-invalid.pug", {login: req.session.login});
            }
        });
    }
});

app.get("/logout/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    req.session.login = undefined;
    res.render("logout.pug", {login: req.session.login});
});


app.get("/register/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    res.render("register.pug", {login: req.session.login});
});



app.post("/register/", (req, res) => {
    if (req.session.login) {
        res.redirect("/");
    } else {
        userData.find({"UserName": req.body.username}, (err, data) => {
            if (data.length) {
                res.render("register-failed.pug");
            } else {
                registerUser(req, res);
                res.render("register-success.pug");
            }
        });
    }
});

app.get("/musics/", (req, res) => {
    musicData.find({}, (err, data) => {
        res.send(data);
    });
});

app.get("/musics/:id", async (req, res) => {
    await cartDatabaseHandler(req, res);
    musicData.findOne({MusicId: req.params.id}, (err, data) => {
        res.render("musics.pug", {data, login: req.session.login});
    });
});

app.get("/cart/", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = new cartData({cart: []});
    }
    res.send(req.session.cart);
});

app.post("/cart/", async (req, res) => {
    req.session.cart = req.body;
    await cartDatabaseHandler(req, res);
    res.send(req.session.cart);
});

app.get("/view-cart/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    res.render("view-cart.pug", {cart: req.session.cart, login: req.session.login});
});

app.get("/checkout/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    res.render("checkout.pug", {cart: req.session.cart, login: req.session.login});
});

app.post("/checkout/", async (req, res) => {
    if (req.body.testUserName) {
        userData.find({"UserName": req.body.testUserName}, (err, data) => {
            if (data.length) {
                res.send("Username Duplicated!");
            } else {
                res.send("");
            }
        });
    }
});

app.get("/invoice/", async (req, res) => {
    await cartDatabaseHandler(req, res);
    if (!req.session.login && req.query.username) {
        registerUser(req, res);
    }
    res.render("invoice.pug", {cart: req.session.cart, login: req.session.login, data: req.query});
});

app.listen(process.env.PORT || 3000, () => {
    console.log("listening");
});


function registerUser(req, res) {
    let user = new userData({
        "UserName": req.body.username ? req.body.username : req.query.username,
        "Password": req.body.password ? req.body.password : req.query.password
    });
    user.save((err, result) => {
        if (err) {
            console.log("Database error: " + err);
            res.sendStatus(500);
        } else {
            console.log("New user", user.UserName);
        }
    });
    req.session.login = req.body.username ? req.body.username : req.query.username;
}

async function cartDatabaseHandler(req, res) {
    if (!req.session.cart) {
        req.session.cart = new cartData({cart: []});
    }
    if (req.session.login) {
        cartData.findOne({UserName: req.session.login}, (err, data) => {
            if (data) {
                if (req.session.cart.cart.length) {
                    req.session.cart._id = data._id;
                    req.session.cart.UserName = data.UserName;
                } else {
                    req.session.cart = data;
                }
                let dataToSave = new cartData(req.session.cart);
                dataToSave.updateOne(req.session.cart, (err, result) => {
                        if (err) {
                            console.log("Database error: " + err);
                            res.sendStatus(500);
                        }
                    }
                );
            } else {
                req.session.cart.UserName = req.session.login;
                let dataToSave = new cartData(req.session.cart);
                dataToSave.save((err, result) => {
                        if (err) {
                            console.log("Database error: " + err);
                            res.sendStatus(500);
                        } else {
                            console.log("Cart Record added");
                        }
                    }
                );
            }
            req.session.save();
        });
    }
}

//https://ithelp.ithome.com.tw/articles/10187464
//https://mongoosejs.com/docs/index.html
