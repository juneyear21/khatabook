const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); // Add fs module

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Render 'index.ejs' and pass the 'files' array
        res.render('index', { files });
        console.log('Root route accessed');
    });
});

app.get('/create', (req, res) => {
    const date = new Date();
    const currentDate = date.toISOString().split('T')[0]; // Safer file naming

    fs.writeFile(`./files/${currentDate}`, 'Item 1', function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('We encountered an issue');
        } else {
            res.send('File Created');
            console.log(`${currentDate} file created`);
        }
    });
});

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading the file');
        }
        res.render('edit', { data, filename: req.params.filename });
    });
});

app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error writing the file');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error deleting the file');
        }
        console.log(`${req.params.filename} deleted`);
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
