const router = require("express").Router();
const ctrl = require("../controllers/codeController");

router.post("/run", ctrl.runCode);
router.post("/submit", ctrl.submitCode);
router.get("/status/:id", ctrl.statusSubmit);
router.get("/submission/:id/:userid", ctrl.listAllSubmission);
router.get("/download/:id", ctrl.downloadSubmission);

module.exports = router;
