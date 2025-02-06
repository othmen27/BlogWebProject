import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
function readBlogs(callback) {
    fs.readFile("blogs.txt", function (err, result) {
        if (err) {
            if (err.code === "ENOENT") {
                return callback([], []);
            }
            throw err;
        }

        let titles = [];
        let texts = [];
        let result1 = String(result);
        let result2 = String(result);
        let i = 0;

        while (result1.indexOf("title=") !== -1) {
            titles[i] = result1.substring(result1.indexOf("title=") + 7, result1.indexOf("text="));
            result1 = result1.substring(result1.indexOf("text=") + 5, result1.length);
            i += 1;
        }

        i = 0;
        while (result2.indexOf("text=") !== -1) {
            texts[i] = result2.substring(result2.indexOf("text=") + 5, result2.indexOf("title="));
            result2 = result2.substring(result2.indexOf("text=") + 5, result2.length);
            i += 1;
        }

        callback(titles, texts);
    });
}

app.get("/", (req, res) => {
    readBlogs((titles, texts) => {
        res.render("index.ejs", { titles: titles, texts: texts });
    });
});
app.post("/submit", (req, res) => {
    const blog = req.body;
    const text = blog["des"];
    const title = blog["title"];
    const completeblog = "title= " + title + " text= " + text;

    fs.readFile("blogs.txt", function (err, data) {
        if (err) {
            if (err.code === "ENOENT") {
                data = "";
            } else {
                throw err;
            }
        }

        data = data + "\n" + completeblog;
        fs.writeFile("blogs.txt", data, (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
        });
    });
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});