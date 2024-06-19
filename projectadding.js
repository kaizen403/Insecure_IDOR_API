const prisma = require("./prismaClient.js");

async function createProject() {
  try {
    const newProject = await prisma.project.create({
      data: {
        name: "IDOR testing",
        description: "hr:humanresources124$",
      },
    });
    console.log("Project created:", newProject);
    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

async function linkProjectToEmployee(projectId, employeeId) {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        projects: {
          connect: { id: projectId },
        },
      },
    });
    console.log("Project linked to employee:", updatedEmployee);
  } catch (error) {
    console.error("Error linking project to employee:", error);
  }
}

(async () => {
  const project = await createProject();
  if (project && project.id) {
    await linkProjectToEmployee(project.id, 5);
  }
})();
