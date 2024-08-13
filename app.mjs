// Express.js
import express from 'express'
// Handlebars (https://www.npmjs.com/package/express-handlebars)
import { engine } from 'express-handlebars'
import session from 'express-session';




const app = express()
const router = express.Router();
const port = process.env.PORT || '3000';

app.use(express.static('public'));
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');


app.use(router);
router.use(express.urlencoded({ extended: true }));

router.route('/').get((req, res) => {
    res.render('main');
});

router.route('/login').get((req, res) => {
    res.render('login');
});

router.route('/register').get((req, res) => {
    res.render('register');
});

router.route('/home').get((req, res) => {
    res.redirect('/');
});

router.route('/about').get((req, res) => {
    res.render('about');
});

router.route('/contact').get((req, res) => {
    res.render('contact');
});

router.use((req, res) => {
    res.render('catcherror');
});



const PORT=process.env.PORT || 3000;
const server = app.listen(PORT, () => { console.log(`http://127.0.0.1:${PORT}`) });

