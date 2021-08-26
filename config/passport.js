var fs = require("fs"),
  passport = require("passport"),
  SamlStrategy = require("passport-saml").Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new SamlStrategy(
    {
      entryPoint: "https://login.soedev.net/adfs/ls/",
      issuer: "https://1inoi6ur59.execute-api.ap-southeast-1.amazonaws.com/dev/adfs/services/trust",
      callbackUrl: "https://1inoi6ur59.execute-api.ap-southeast-1.amazonaws.com/dev/auth/login/callback",
      cert: fs.readFileSync("./certificate.pem", "utf-8"),
      // authnContext: ['http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows'],
      identifierFormat: null,
    },
    function (profile, done) {
      return done(null, {
        upn: profile[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"
        ],
        // e.g. if you added a Group claim
        group: profile["http://schemas.xmlsoap.org/claims/Group"],
      });
    }
  )
);

module.exports = passport;
