const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const mongoClient = mongodb.MongoClient;
const port = process.env.PORT || 3000;
let dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";

app.use(express.json());
app.use(cors());

app.listen(port, ()=> console.log(`your app is running on port ${port}`));


app.get("/", async(req,res)=>{
    try{
        let client = await mongoClient.connect(dbUrl);
        let db = client.db("studentMentorDetails");
        let result = await db.collection("student").find().toArray();
        res.status(200).json({message:"All data is", result});
        client.close();
    }
    catch(error){
        console.log(error);
        res.send(500);
    }
});

app.get("/get-student/:mentor-name", async (req, res) => {
    try {
      let client = await mongodb.connect(dbUrl);
      let db = client.db("B15_WE");
      let result = await db.collection("mentor").findOne({ _id: req.params.mentor-name });
      res.status(200).json({ result });
      client.close();
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });

app.post("/add-student", async(req,res)=>{
    try{
        let client = await mongoClient.connect(dbUrl);
        let db = client.db("studentMentorDetails");
        let data = await db.collection("student").findOne({ email: req.body.email });
        if (data) {
            res.status(400).json({
                message: "Student already exists",
            });
        }
        else{
            let result = await db.collection("student").insertOne(req.body);
            res.status(200).json({message:"Student added suceessfully",result});
        }
        
        
        client.close();
    }
    catch(error){
        console.log(error);
        res.send(500);
    }
});

app.post("/add-mentor", async(req,res)=>{
    try{
        let client = await mongoClient.connect(dbUrl);
        let db = client.db("studentMentorDetails");

        let data = await db.collection("mentor").findOne({ email: req.body.email });
        if (data) {
            res.status(400).json({
                message: "Mentor already exists",
            });
        } 
        else{
            let result = await db.collection("mentor").insertOne(req.body);
            console.log("Mentor added suceessfully "+ result);
            res.status(200).json({message:"Mentor added suceessfully",result});
        }
        
        client.close();
    }
    catch(error){
        console.log(error);
        res.send(500);
    }
});


app.put("/change-mentor/:studentName", async(req,res)=>{
    try{
        let client = await mongoClient.connect(dbUrl);
        let db = client.db("studentDetails");
        let result = await db.collection("student").findOneAndUpdate({_id: req.params.studentName},{$set:req.body});

        res.status(200).json({message:"Mentor Updated successfully",result});
        client.close();
    }
    catch(error){
        console.log(error);
        res.send(500);
    }
});

app.put("/assign-students/:mentorName", async(req,res)=>{
    try{
        let client = await mongoClient.connect(dbUrl);
        let db = client.db("studentDetails");
        let result = await db.collection("mentor").findOneAndUpdate({_id: req.params.mentorName},{$set:req.body});

        res.status(200).json({message:"Students Assigned successfully",result});
        client.close();
    }
    catch(error){
        console.log(error);
        res.send(500);
    }
});






