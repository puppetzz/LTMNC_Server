const router = require("express").Router();
const ctrl = require("../controllers/authController");
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/success", (req, res) => {
  res.status(200).json(req.user);
});

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

module.exports = router;
