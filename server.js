const express=require("express");
const cors=require("cors");
const app=express();
const sqlite3=require("sqlite3").verbose();
let sql;

//connect to db
const db=new sqlite3.Database("./test.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.log(err.message);
})

// sql=`CREATE TABLE users(id INTEGER PRIMARY KEY,name,username,email,street,suite,city,zipcode,lat,lng,phone,website,companyName,catchPhrase,bs)`;
// db.run(sql);

// sql=`DROP TABLE users`
// db.run(sql)

app.use(cors());

app.get("/v1/users",async (req,res)=>{
    const search=req.query.searchText
    sql=`SELECT * FROM users INNER JOIN posts ON users.id=posts.userId WHERE users.name LIKE "%${search}%"`
    db.all(sql,[],(err,rows)=>{
            if(err) return console.error(err.message)
            res.json(rows)
        })
    
})



const fetching=async()=>{
    const response=await fetch("https://jsonplaceholder.typicode.com/users")
    const data=await response.json()
    sql=`INSERT INTO users(id,name,username,email,street,suite,city,zipcode,lat,lng,phone,website,companyName,catchPhrase,bs) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    data.map((eachItem)=>db.run(sql,[eachItem.id,eachItem.name,eachItem.username,eachItem.email,eachItem.address.street,eachItem.address.suite,eachItem.address.city,eachItem.address.zipcode,eachItem.address.geo.lat,eachItem.address.geo.lng,eachItem.phone,eachItem.website,eachItem.company.name,eachItem.company.catchPhrase,eachItem.company.bs],(err)=>{
        if(err) return console.log(err.message)
    }))
}
// fetching()

// sql=`SELECT * FROM users`
// db.all(sql,[],(err,rows)=>{
//     if(err) return console.error(err.message)
//     rows.forEach(row=>{
//         console.log(row)
//     })
// })



app.listen(8081,()=>{
    console.log("listening")
})
