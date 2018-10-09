const passport = require("koa-passport");
const Account = require("./models/account");
const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  await ctx.render("index", { user: ctx.state.user });
});

router.get("/register", async (ctx, next) => {
  await ctx.render("register", {});
});

router.post("/register", async (ctx, next) => {
  console.log("registering user");
  Account.register(
    new Account({ username: ctx.request.body.username }),
    ctx.request.body.password,
    function(err) {
      if (err) {
        console.log("error while user register!", err);
        return next(err);
      }

      console.log("user registered!");

      ctx.redirect("/");
    }
  );
});

router.get("/login", async (ctx, next) => {
  await ctx.render("login", { user: ctx.status.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/logout", async (ctx, next) => {
  ctx.logout();
  ctx.redirect("/");
});

module.exports = router;
