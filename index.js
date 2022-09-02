const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
app.use(express.static(__dirname + "/public"));

const uploadDir = "uploads";
const upload = multer(multer.memoryStorage());
app.use(`/${uploadDir}`, express.static(uploadDir));

app.post("/uploadImage", upload.single("uploadImage"), async (req, res) => {
    fs.access(uploadDir, (error) => {
        if (error)
            fs.mkdirSync(uploadDir);
    });
    const { buffer, originalname } = req.file;
    const fileName = `${new Date().getTime()}${Math.floor(Math.random() * 1000)}-${originalname}.webp`;
    await sharp(buffer)
        .resize({ height: 500, width: 500 })
        .webp({ quality: 100 })
        .toFile(`./${uploadDir}/${fileName}`);
    return res.send(`http://localhost:3000/${uploadDir}/${fileName}`);
});

app.listen(3000);