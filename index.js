const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const upload = multer(multer.memoryStorage());
const uploadDir = "uploads";

app.use(`/${uploadDir}`, express.static(uploadDir));
app.use(express.static(__dirname + '/public'));

function randomString(size) {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    let randomStr = "";
    for (let i = 0; i < size; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];
    return randomStr;
}

app.post("/uploadImage", upload.single("uploadImage"), async (req, res) => {
    fs.access(uploadDir, (error) => {
        if (error)
            fs.mkdirSync(uploadDir);
    });
    const { buffer, originalname } = req.file;
    const fileName = `${randomString(10)}-${originalname}.webp`;
    await sharp(buffer)
        .resize({ height: 500, width: 500 })
        .webp({ quality: 100 })
        .toFile(`./${uploadDir}/${fileName}`);
    return res.send(`http://localhost:3000/${uploadDir}/${fileName}`);
});

app.listen(3000);