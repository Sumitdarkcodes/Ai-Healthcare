const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Google DNS to bypass the Windows Node.js bug

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running on port " + PORT);
        });
    })
    .catch((error) => {
        console.log("Failed to start server", error);
        process.exit(1);
    });