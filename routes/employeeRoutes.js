const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { verifyToken } = require("../auth");

router.get("/search", verifyToken, employeeController.searchEmployees);

router.get("/", verifyToken, employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById); // Vulnerable route
router.post("/", verifyToken, employeeController.createEmployee);
router.put("/:id", verifyToken, employeeController.updateEmployee);
router.delete("/:id", verifyToken, employeeController.deleteEmployee);
router.get(
  "/:id/department",
  verifyToken,
  employeeController.getEmployeeDepartment,
);
router.get(
  "/:id/projects",
  verifyToken,
  employeeController.getEmployeeProjects,
);
router.post(
  "/:id/project",
  verifyToken,
  employeeController.addEmployeeToProject,
);

module.exports = router;
