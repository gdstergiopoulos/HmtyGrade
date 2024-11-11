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
router.use(express.json());
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

router.route('/').get(async (req, res) => {
    let courses1= await model.getCourses(1);
    let courses2= await model.getCourses(2);
    let courses3= await model.getCourses(3);
    let courses4= await model.getCourses(4);
    let courses5= await model.getCourses(5);
    let courses6= await model.getCourses(6);
    let courses10= await model.getCourses(10);
    
    if(req.session.username){
        let courses7= await model.getSelectedCourses(req.session.username,7);
        let courses8= await model.getSelectedCourses(req.session.username,8);
        let courses9= await model.getSelectedCourses(req.session.username,9);
        
        
        res.render('main', {courses1: courses1, courses2: courses2, courses3: courses3, courses4: courses4, courses5: courses5, courses6: courses6,courses7:courses7,courses8: courses8, courses9:courses9 , courses10: courses10, username: req.session.username});
    }
    else
    {   
        res.render('main', {courses1: courses1, courses2: courses2, courses3: courses3, courses4: courses4, courses5: courses5, courses6: courses6, courses10: courses10});
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

router.route('/api/grades').get(async (req, res) => {
    let username = req.session.username;
    if (!username) {
        return res.status(401).send('Unauthorized');
    }
    try {
        let grades = await model.getGrades(username);
        res.json(grades);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
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

router.route('/logout').get((req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.route('/login').post(async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try{
        const user = await model.checkLogin(username, password); 
        // console.log(user)
        if(user){
            req.session.username = username;
            res.redirect('/');
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


router.route('/').post(async (req, res) => {
    let username = req.session.username;
    
    if (!username) {
        return res.redirect('/login');
    }

    let getAllStudentCodes = await model.getAllStudentCodes(username);

    // console.log(getAllStudentCodes);
    let studentCodes = getAllStudentCodes.map(studentcode => studentcode.courseCode);
    // console.log(studentCodes);

    let gradedCourses = await model.getAllGradedCourses(username);
    let gradedCoursesCodes = gradedCourses.map(gradedCourse => gradedCourse.course);
    // console.log(gradedCoursesCodes);

    let ungradedCourses = studentCodes.filter(course => !gradedCoursesCodes.includes(course));
    console.log(ungradedCourses);

    for (const [key, value] of Object.entries(req.body)) {
        console.log('Processing course:', key, 'with value:', value);
        if (ungradedCourses.includes(key)) {
            if (value !== null && value !== undefined && value !== ''){
                console.log("SAVE")
                await model.saveGrade(username, key, value);
                // console.log(`Course ${key} is ungraded and has a grade of ${value}`);
            }
        } else {
            console.log("UPDATE")
            await model.updateGrade(username, key, value);
            // console.log(`Course ${key} is graded and has a grade of ${value}`);
        }
    }
    
    res.redirect('/');
}   
);

router.route('/register').post(async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email= req.body.email;
    let passconf= req.body.confirmpassword;
    console.log(username, password, email, passconf);
    try{
        if (password !== passconf){
            throw "Passwords do not match";
        }
        else{
            let checkuser = await model.checkUser(username);
            let checkemail = await model.checkEmail(email);
            if(checkuser.length > 0 || checkemail.length > 0){
                throw "Username or mail already exists";
            }
            else{
                await model.registerUser(username, email, password);
                res.redirect('/login');
            }
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

