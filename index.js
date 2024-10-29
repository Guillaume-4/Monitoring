const express = require("express");
const path = require("path");
const session = require("express-session");
const CryptoJS = require("crypto-js")
const {executeQuery} = require("./db")
const {CRYPTO_KEY} = require("./config")
const shutDownWin = require('node-shutdown-windows');
const app = express();
const PORT = process.env.PORT || 3000;
var hour = 1000 * 60 * 20;

//-----USES-----
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: CRYPTO_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );


//-----FUNCTION-----
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect("/");
    }
}

app.get("/", (req, res) => {
    res.render("loginpage"); 
});

app.post('/loginok',async(req,res)=>{
    const user = req.body.username
    const pass = req.body.password
    try {
        const DBPass = await executeQuery(
          `SELECT Password from Login where Username = '${user}'`
        );
        if (
          pass ===
          CryptoJS.AES.decrypt(DBPass[0].Password, CRYPTO_KEY).toString(CryptoJS.enc.Utf8)
        ) {
          req.session.user = user;
          req.session.cookie.expires = new Date(Date.now() + hour);
          req.session.cookie.maxAge = hour;
          res.redirect("/home");
        } else {
          res.send("Mot de passe incorrect");
        }
      } catch (e) {
        res.send(`Internal server Error : ${e}`);
      }
});

app.get('/logout', isAuthenticated, (req,res)=>{
  req.session.user = null
  res.redirect("/")
})

app.get("/home", isAuthenticated, (req, res) => {
    res.render("home"); 
});

app.get("/restartok",isAuthenticated,(req, res)=>{
    const test = shutDownWin.reboot(20, false);
    console.log(test)
    res.send("Restart du VPS dans 20 secondes")
})

app.listen(PORT, () => {
    console.log(`App Running on PORT : ${PORT}`);
});