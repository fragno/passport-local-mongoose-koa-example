const Koa = require("koa");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("koa-logger");
const koaBody = require("koa-body");
const views = require("koa-views");
const session = require("koa-session");

const mongoose = require("mongoose");
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

const router = require("./routes");

const app = new Koa();

app.use(async function(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("%s %s - %s", ctx.method, ctx.url, ms, ctx.status);
});

// Must be used before any router is used
app.use(
  views(path.join(__dirname, "views"), {
    extension: "jade"
  })
);

app.keys = ["secretkey1", "secretkey2", "..."];
app.use(session(app));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger());
app.use(koaBody());

app.use(require("koa-static")(path.join(__dirname, "public")));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const Account = require("./models/account");
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect mongoose
mongoose.connect(
  "mongodb://localhost/passport_local_mongoose_examples",
  { useNewUrlParser: true },
  function(err) {
    if (err) {
      console.log(
        "Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!"
      );
    }
  }
);

// Register routes
app.use(router.routes(), router.allowedMethods());

module.exports = app;
