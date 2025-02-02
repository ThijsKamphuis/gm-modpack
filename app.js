const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4727;
const files = fs.readdirSync(__dirname);
const zipFile = files.find(file => file.endsWith(".zip"));
if (zipFile) {
    zipname = path.basename(zipFile, ".zip");
} else {
    throw new Error("No zip file found in the directory");
}

const zipFilePath = path.join(__dirname, zipname + ".zip");
app.use((req, res, next) => {
    res.on("close", () => {
        if (!res.headersSent) {
            console.log("Download canceled by the user");
        }
    });
    next();
});
app.get("/download", (req, res) => {
    res.download(zipFilePath, `${zipname}.zip`, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error downloading file");
        }
        console.log(req.ip);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
