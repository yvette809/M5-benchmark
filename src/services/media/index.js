const express = require ("express")
const fs = require ("fs")
const path = require("path")
 const mediaRouter = express.Router()

 const mediaFilePath = path.join(__dirname, "media.json")
 const getMovies = () =>{
     const mediaFileBuffer = fs.readFileSync(mediaFilePath)
     const mediasString = mediaFileBuffer.toString()
     const media = JSON.parse(mediaString)
     return media

 }
 mediaRouter.get("/", (req,res,next)=>{

 })












 module.exports = mediaRouter