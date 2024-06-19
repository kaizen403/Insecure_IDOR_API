const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const employees = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      department: "Engineering",
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      department: "Marketing",
    },
    {
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      department: "Sales",
    },
    {
      name: "David Wilson",
      email: "david.wilson@example.com",
      department: "Engineering",
    },
    {
      name: "Eve Davis",
      email: "eve.davis@example.com",
      department: "HR",
    },
    // New Engineering Employees
    {
      name: "Frank Thomas",
      email: "frank.thomas@example.com",
      department: "Engineering",
    },
    {
      name: "Grace Lee",
      email: "grace.lee@example.com",
      department: "Engineering",
    },
    {
      name: "Hannah Wright",
      email: "hannah.wright@example.com",
      department: "Engineering",
    },
    {
      name: "Ian Scott",
      email: "ian.scott@example.com",
      department: "Engineering",
    },
  ];

  const projects = [
    {
      name: "Employee Management System",
      description: "A system to manage employee records and operations",
    },
    {
      name: "Marketing Campaign Tracker",
      description: "A tool to track the effectiveness of marketing campaigns",
    },
    {
      name: "Sales Dashboard",
      description: "A dashboard to monitor sales metrics and performance",
    },
    {
      name: "Engineering Task Manager",
      description: "A task management system for engineering projects",
    },
    {
      name: "username: hr",
      description: "password: humanresources124$",
    },
  ];

  // Upsert employees
  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {},
      create: employee,
    });
  }

  // Upsert projects
  for (const project of projects) {
    const existingProject = await prisma.project.findFirst({
      where: { name: project.name },
    });

    if (existingProject) {
      await prisma.project.update({
        where: { id: existingProject.id },
        data: project,
      });
    } else {
      await prisma.project.create({
        data: project,
      });
    }
  }

  // Add employees to projects
  const alice = await prisma.employee.findUnique({
    where: { email: "alice.johnson@example.com" },
  });
  const bob = await prisma.employee.findUnique({
    where: { email: "bob.smith@example.com" },
  });
  const charlie = await prisma.employee.findUnique({
    where: { email: "charlie.brown@example.com" },
  });
  const david = await prisma.employee.findUnique({
    where: { email: "david.wilson@example.com" },
  });
  const eve = await prisma.employee.findUnique({
    where: { email: "eve.davis@example.com" },
  });
  const frank = await prisma.employee.findUnique({
    where: { email: "frank.thomas@example.com" },
  });
  const grace = await prisma.employee.findUnique({
    where: { email: "grace.lee@example.com" },
  });
  const hannah = await prisma.employee.findUnique({
    where: { email: "hannah.wright@example.com" },
  });
  const ian = await prisma.employee.findUnique({
    where: { email: "ian.scott@example.com" },
  });

  const projectEMS = await prisma.project.findFirst({
    where: { name: "Employee Management System" },
  });
  const projectMCT = await prisma.project.findFirst({
    where: { name: "Marketing Campaign Tracker" },
  });
  const projectSD = await prisma.project.findFirst({
    where: { name: "Sales Dashboard" },
  });
  const projectETM = await prisma.project.findFirst({
    where: { name: "Engineering Task Manager" },
  });
  const projectHROP = await prisma.project.findFirst({
    where: { name: "username: hr" },
  });

  const employeeProjects = [
    { employee: alice, project: projectEMS },
    { employee: bob, project: projectMCT },
    { employee: charlie, project: projectSD },
    { employee: david, project: projectETM },
    { employee: eve, project: projectHROP },
    { employee: frank, project: projectETM },
    { employee: grace, project: projectEMS },
    { employee: hannah, project: projectETM },
    { employee: ian, project: projectEMS },
  ];

  for (const { employee, project } of employeeProjects) {
    await prisma.employee.update({
      where: { id: employee.id },
      data: { projects: { connect: { id: project.id } } },
    });
  }

  console.log("Mock data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
