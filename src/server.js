const { PORT = 8000 } = process.env;
const app = require("./app");

const listener = () => console.log(`Server is listening on Port ${PORT}...`);
app.listen(PORT, listener);