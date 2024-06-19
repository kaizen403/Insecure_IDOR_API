const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");
const employeeRouter = require("./routes/employeeRoutes.js");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
