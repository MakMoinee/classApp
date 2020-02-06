var express = require('express');
var router = express.Router();
var fs = require('fs');
const sql = require('mssql');
const db ={
    "server": "MAKMOINEE-PC",
    "user": "sa",
    "password": "123",
    "Persist Integrated Security": "true",
    "database" : "BACApp"
};
const pool = new sql.ConnectionPool(db);
pool.connect().then(function () {

    console.log("Sql Server Connected");


}).catch(function (err) {
    if(err)
    {
        console.log(err);

    }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/classData',function (reqs,res,next) {
    var req = new sql.Request(pool);
    req.query('USE DBClass; Select * from tblUsers',function (error,rows) {
        if(error)
        {
            res.send(error);
            res.end();
        }
        else
        {
            if(rows.rowsAffected>0)
                {
                    res.send(JSON.stringify(rows));
                    res.end();
                }
            else
            {
                res.send('2');
                res.end();
            }

        }
    });
});
router.post('/logging',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spLogMeIn '" + reqs.body.un + "','" + reqs.body.pw + "'",function(err,rows){
        if(err)
        {
            console.log(err);
            res.send("3");
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {
                res.send("1");
                res.end();
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.post('/loggingSubjects/',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spLogMeIn '" + reqs.body.un + "','" + reqs.body.pw + "'",function(err,rows){
        if (err) {
            console.log(err);
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {

                 let newResults = [];
                    for(let key in rows){
                       if(key === "recordsets"){
                          rows[key].forEach(arr =>{
                            arr.forEach(obj =>{
                                Object.keys(obj).forEach((key) =>{
                                  newResults.push(obj[key])
                                })
                              });
                          })
                       }
                    }
                    res.redirect("/getMySubjects/" + newResults.toString() + "/" + reqs.body.sem + "/" + reqs.body.scholYr + "");
                    /*    console.log(JSON.stringify(rows.recordset));
                    res.send(JSON.stringify(rows.recordset));
                    res.end();*/
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.get('/getMySubjects/:uid/:sem/:scholYr',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spGetMyInstructorIDByLogin " + reqs.params.uid + ","+reqs.params.sem +",'"+ reqs.params.scholYr +"'",function(err,rows){
        if (err) {
            console.log(err);
            res.send(err);
            res.end();
        }
        else
        {
               
                    if (JSON.stringify(rows.recordset)=="[]") {
                            res.send("2");
                            res.end();
                    }
                    else
                    {
                        res.send(JSON.stringify(rows.recordset));
                     console.log(JSON.stringify(rows.recordset));
                        res.end();
                    }
                     
        }
    });
});

router.post('/getFilterSubjects',function(reqs,res,next){
    var req = new sql.Request(pool);

    req.query("USE DBClass; exec spGetFilterSubject '" + reqs.body.search + "'," + reqs.body.uid + ",2,'2018-2019'",function(err,rows){
                  if (err) {
            console.log(err);
            res.send(err);
            res.end();
        }
        else
        {
               
                    if (rows.rowsAffected>0) {
                         res.send(JSON.stringify(rows.recordset));
                         res.end();
                    }
                    else
                    {
                        res.send("2");
                        res.end();
                    }
        }
    });
});

router.post('/loggingWithData',function(reqs,res,next){
    var req = new sql.Request(pool);

    req.query("USE DBClass; exec spLogMeInWithData '" + reqs.body.un + "','" + reqs.body.pw + "'",function(error,rows){
        if (error) {
            console.log(error);
            res.send("3");
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {
                res.send(JSON.stringify(rows.recordset));
                res.end();
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.post('/loadStudents',function(reqs,res,next){
  var req = new sql.Request(pool);
    req.query("USE DBClass; exec spLogMeIn '" + reqs.body.un + "','" + reqs.body.pw + "'",function(err,rows){
        if (err) {
            console.log(err);
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {
                 let newResults = [];
                    for(let key in rows){
                       if(key === "recordsets"){
                          rows[key].forEach(arr =>{
                            arr.forEach(obj =>{
                                Object.keys(obj).forEach((key) =>{
                                  newResults.push(obj[key])
                                })
                              });
                          })
                       }
                    }
                    res.redirect("/getMyInstructorID/" + newResults.toString() + "/" + reqs.body.subj +"/" + reqs.body.classID + "/" + reqs.body.sem + "/" + reqs.body.scholYr + "");
                    /*    console.log(JSON.stringify(rows.recordset));
                    res.send(JSON.stringify(rows.recordset));
                    res.end();*/
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.get('/getMyInstructorID/:uid/:subj/:classID/:sem/:scholYr',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spGetMyInstructorID " + reqs.params.uid + "",function(error,rows){
        if (error) {
            console.log(error);
            res.send("3");
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {
                     let newResults = [];
                    for(let key in rows){
                       if(key === "recordsets"){
                          rows[key].forEach(arr =>{
                            arr.forEach(obj =>{
                                Object.keys(obj).forEach((key) =>{
                                  newResults.push(obj[key])
                                })
                              });
                          })
                       }
                    }
                    console.log(rows.recordset)
                     res.redirect("/getMyStudents/" + newResults.toString() + "/" + reqs.params.subj +"/" + reqs.params.classID + "/" + reqs.params.sem + "/" + reqs.params.scholYr + "");
            }
            else{
                    res.send("2");
                    res.end();
            }
        }
    });
});
router.get('/getMyStudents/:uid/:subj/:classID/:sem/:scholYr',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spShowListOfStudents " + reqs.params.classID +","+reqs.params.uid + "," + reqs.params.subj + ","+ reqs.params.sem + ",'"+ reqs.params.scholYr +"'",function(error,rows){
        if (error) {
            console.log(error);
            res.send("3");
            res.end();
        }
        else
        {
            if (rows.rowsAffected>0) {
                res.send(JSON.stringify(rows.recordset));
                res.end();
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.post('/validate',function(reqs,res,next){
    var req = new sql.Request(pool);

    req.query("USE DBClass; exec spValidateStud '" + reqs.body.studID + "'",function(err,rows){
        if (err) {
            console.log(err);
            res.send("3");
            res.end();
        }
        else
        {
           if (JSON.stringify(rows.recordset)=="[]") {
                res.send("4");
                res.end();
           }
           else
           {
                 let newResults = [];
                    for(let key in rows){
                       if(key === "recordsets"){
                          rows[key].forEach(arr =>{
                            arr.forEach(obj =>{
                                Object.keys(obj).forEach((key) =>{
                                  newResults.push(obj[key])
                                })
                              });
                          })
                       }
                    }
                    if (newResults.toString()=="0") {
                            res.send("2");
                            res.end();
                    }
                    else
                    {
                        res.send("1");
                        res.end();
                    }
                
           }
        }
    });
});
router.post('/addAttendance',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spInsertAttendance " +reqs.body.classID + ","+ reqs.body.term +"," + reqs.body.studID + ",'" + reqs.body.dets + "','" + reqs.body.stat + "'",function(error,rows){
        if (error) {
            console.log(error);
            res.send("3");
            res.end();
        }
        else{
            if (JSON.stringify(rows.recordset)==undefined) {
                    console.log(rows);
                    res.send("1");
                    res.end();
            }
            else
            {
                console.log(rows);
                    res.send("2");
                    res.end();
            }
        }
    })
});
router.post('/getAttendances',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spGetAttendance " + reqs.body.classID + ",'" + reqs.body.dets + "'," + reqs.body.term +"", function(error, rows){
            if (error) {
                console.log(error);
                 
                res.send("3");
                res.end();
            }
            else{
                if(rows.rowsAffected>0)
                {
                    res.send(JSON.stringify(rows.recordset));
                    res.end();
                }
                else
                {
                    res.send("2");
                    res.end();
                }
            }
    });
});
router.get('/loadMyYear',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spGetMyYear", function(error,rows){
        if(error)
        {
            console.log(error);
            res.send("3");
            res.end();
        }
        else
        {
            if(rows.rowsAffected>0)
            {
                res.send(JSON.stringify(rows.recordset));
                res.end();
            }
            else
            {
                res.send("2");
                res.end();
            }
        }
    });
});
router.post('/insertTerm',function(reqs,res,next){
    var req = new sql.Request(pool);
    req.query("USE DBClass; exec spInserTerm " + reqs.body.term + "," + reqs.body.classID + "", function(error,rows){
        if(error)
        {
            console.log("insertTerm: " + error);
            res.send("3");
            res.end();
        }
        else{
            if (rows.rowsAffected>0) {
                console.log("Failed To Add Term");
                res.send("");
                res.end();
            }
            else
            {
                console.log("Successfully Added Terms");
                res.send("");
                res.end();
            }
        }
    });
});

module.exports = router;
