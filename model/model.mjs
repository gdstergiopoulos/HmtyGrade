import db from 'better-sqlite3'

const sql= new db('model/hmtygrade.sqlite', { fileMustExist: true });

export let checkLogin = (username, password) => {
    let stmt = sql.prepare('SELECT username FROM Account WHERE username = ? AND password = ?');
    try{
        let user = stmt.all(username, password);
        // console.log(user[0].username);
        return user;
    }
    catch(err){
        throw err;
    }
}   