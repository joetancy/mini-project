var passport = require("passport");
var express = require("express");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var app = express();
require("./config/passport.js");
const serverlessExpress = require("@vendia/serverless-express");

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.get(
  "/login",
  passport.authenticate("saml", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post(
  "/login/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  function (req, res) {
    const token = jwt.sign(req.user, "9DBE9E4C8D28446A9D1263F4516B6");
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

app.post("/assert", function (req, res) {
  try {
    var decoded = jwt.verify(
      req.cookies.token,
      "9DBE9E4C8D28446A9D1263F4516B6"
    );
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false, error: err });
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// app.listen(3000, () => {
//   console.log(`Example app listening at http://localhost:3000`);
// });

exports.handler = serverlessExpress({ app });
