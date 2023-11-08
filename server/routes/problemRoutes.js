const router = require("express").Router();
const ctrl = require('../controllers/problemController');

router.get("/", ctrl.listProblem);
router.get("/:id", ctrl.getProblem);
router.post("/add", ctrl.addProblem);
router.put("/edit/:id", ctrl.editProblemById);
router.delete("/delete/:id", ctrl.removeProblem);

module.exports = router;
