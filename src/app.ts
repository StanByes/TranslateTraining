import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import createError, { HttpError } from "http-errors";
import path from "path";
const translate = require("translatte");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/generate", async (req, res) => {
    res.contentType("json");

    const { count, lang } = req.query;
    if (!count || !lang)
        return res.status(400).send("Bad request");

    if (lang != "es" && lang != "en")
        return res.status(400).send("Unknown langage");

    const words = await fetch(`https://random-word-api.herokuapp.com/word?lang=${lang}&number=${count}`, {method: "GET"});
    const jsonWords: string[] = await words.json();

    const result: any[] = [];
    for (let word of jsonWords) {
        const translation = await translate(word, {
            from: lang,
            to: "fr"
        });
        result.push({
            base: word,
            translate: translation.text
        });
    }

    return res.status(200).send(result);
})

app.use((req, res, next) => {
    next(createError(404));
});
  
// error handler
app.use(function(err: HttpError, req: Request, res: Response) {
    res.status(err.statusCode);
    return res.send(`${req.method} ${req.originalUrl} [${err.statusCode}] ${err.message}`);
});

app.listen(3000, () => {
    console.log("App launched");
});