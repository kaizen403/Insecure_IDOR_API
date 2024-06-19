const prisma = require("../prismaClient");

const getAllEmployees = async (req, res) => {
  try {
    // Allow access only for admin users or anonymous users (to demonstrate IDOR vulnerability)
    if (req.userId !== "anonymous" && !req.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Allow access without proper authentication to demonstrate IDOR vulnerability
    if (
      req.userId === "anonymous" ||
      req.userId === employee.id ||
      req.isAdmin
    ) {
      return res.json(employee);
    }

    res.status(403).json({ error: "Access denied" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const newEmployee = await prisma.employee.create({
      data: { name, email, department },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department } = req.body;

    // Allow updating only if the requester is the owner or an admin
    if (
      req.userId !== "anonymous" &&
      req.userId !== parseInt(id, 10) &&
      !req.isAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id, 10) },
      data: { name, email, department },
    });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow deleting only if the requester is the owner or an admin
    if (
      req.userId !== "anonymous" &&
      req.userId !== parseInt(id, 10) &&
      !req.isAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.employee.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { name = "", department = "" } = req.query;

    // Allow access only for admin users or anonymous users (to demonstrate IDOR vulnerability)
    if (req.userId !== "anonymous" && !req.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const employees = await prisma.employee.findMany({
      where: {
        ...(name && { name }),
        ...(department && { department }),
      },
    });

    console.log("Query Result:", employees); // Log the result of the query
    res.json(employees);
  } catch (error) {
    console.error("Error in searchEmployees:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id, 10) },
      select: { department: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Allow access without proper authentication to demonstrate IDOR vulnerability
    if (
      req.userId === "anonymous" ||
      req.userId === employee.id ||
      req.isAdmin
    ) {
      return res.json({ department: employee.department });
    }

    res.status(403).json({ error: "Access denied" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id, 10) },
      include: { projects: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Allow access without proper authentication to demonstrate IDOR vulnerability
    if (
      req.userId === "anonymous" ||
      req.userId === employee.id ||
      req.isAdmin
    ) {
      return res.json(employee.projects);
    }

    res.status(403).json({ error: "Access denied" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addEmployeeToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId } = req.body;

    // Allow updating only if the requester is the owner or an admin
    if (
      req.userId !== "anonymous" &&
      req.userId !== parseInt(id, 10) &&
      !req.isAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id, 10) },
      data: {
        projects: {
          connect: { id: parseInt(projectId, 10) },
        },
      },
    });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeDepartment,
  getEmployeeProjects,
  addEmployeeToProject,
};
