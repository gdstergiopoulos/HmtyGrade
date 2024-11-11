// Express.js
import express from 'express'
// Handlebars (https://www.npmjs.com/package/express-handlebars)
import { engine } from 'express-handlebars'
import session from 'express-session';
import * as model from './model/model.mjs'



const app = express()
const router = express.Router();
const port = process.env.PORT || '3000';

app.use(express.static('public'));
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');


app.use(router);
router.use(express.urlencoded({ extended: true }));

router.use(session({
        
    secret: process.env.SESSION_SECRET || "PynOjAuHetAuWawtinAytVunar", // κλειδί για κρυπτογράφηση του cookie
    resave: false, // δεν χρειάζεται να αποθηκεύεται αν δεν αλλάξει
    saveUninitialized: false, // όχι αποθήκευση αν δεν έχει αρχικοποιηθεί
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, //TWO_HOURS χρόνος ζωής του cookie σε ms
      sameSite: true
    }
  }));

router.route('/').get((req, res) => {
    if(req.session.username){
        res.render('main', {username: req.session.username});
    }
    else
    {
        res.render('main');
    }
});

router.route('/login').get((req, res) => {
    if(req.session.username){
        res.render('myprofile', {username: req.session.username});
    }
    else{
        res.render('login');
    }
});

router.route('/register').get((req, res) => {
    res.render('register');
});

router.route('/home').get((req, res) => {
    res.redirect('/');
});

router.route('/about').get((req, res) => {
    if(req.session.username){
        res.render('about', {username: req.session.username});
    }
    else{
        res.render('about');
    }
    
});

router.route('/contact').get((req, res) => {
    if(req.session.username){
        res.render('contact', {username: req.session.username});
    }
    else{
        res.render('contact');
    }
});

router.route('/login').post(async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try{
        const user = await model.checkLogin(username, password); 
        if(user.length > 0){
            req.session.username = username;
            res.redirect('/home');
        }
        else{
            res.redirect('/login');
        }
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
});

router.use((req, res) => {
    res.render('catcherror');
});



const PORT=process.env.PORT || 3000;
const server = app.listen(PORT, () => { console.log(`http://127.0.0.1:${PORT}`) });

