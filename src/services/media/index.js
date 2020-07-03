const express = require ("express")
const fs = require ("fs")
const path = require("path")
const uniqid = require ("uniqid")
const{check,validationResult, sanitizeBody} = require("express-validator")
const { networkInterfaces } = require("os")
 const mediaRouter = express.Router()

 const mediaFilePath = path.join(__dirname, "media.json")
 const getMedia = () =>{
     const mediaFileBuffer = fs.readFileSync(mediaFilePath)
     const mediaString = mediaFileBuffer.toString()
     const media = JSON.parse(mediaString)
     return media

 }

 // get all media
 mediaRouter.get("/", (req,res,next)=>{
    try{
        const media = getMedia()
        if(media){
            res.status(200).send(media)
        }else{
            const error = new Error( "no media found")
            error.httpStatusCode = 404
            next(error)
        }

    }catch(error){
        next(error)
    }
     

 })

 // get media with a specific id
 mediaRouter.get("/:asin", (req,res,next)=>{
     try{
        const media = getMedia()
        const singleMedia = media.find(media => media.imdID === req.params.imdID)
        if(singleMedia){
            res.status(200).send(singleMedia)
        }else{
            const error = new Error("media not found")
            error.httpStatusCode = 404
            next(error)

        }

     }catch(error){
         next(error)
     }
         
 })

 //create a media (post)
 const validation = [
     check("imdbID").exists().withMessage("you should specify the id"),
     check("title").exists().withMessage("title is required").isLength({min: 3}),
     check("poster").exists().withMessage("image is required"),
     check("type").isEmpty().withMessage("type is required")

 ]

 mediaRouter.post("/", validation,(req,res,next)=>{
     const errors = validationResult(req)
     if(!errors.isEmpty){
         const error = new Error()
         error.httpStatusCode = 400
         error.message = errors
         next (error)
     }else{
         try{
            const media = getMedia()
            const newMedia = {...req.body, imdbID : uniqid(), addedAt: new Date()}
             media.push(newMedia)
            fs.writeFileSync(mediaFilePath, JSON.stringify(media))
            res.status(201).send(newMedia)

         }catch(error){
             next(error)
         }
     }
 })

   
// edit media

mediaRouter.put("/:asin", (req,res,next)=>{
    try{
        const media = getMedia()
        const mediaFound = media.find(m=> m.imdbID === req.params.imdbID)
        if (mediaFound){
            const mediaPosition = media.indexOf(media)
            const updatedMedia = {...media, ...req.body}
            media[mediaPosition] = updatedMedia
            fs.writeFileSync(mediaFilePath, media)
            res.send(updatedMedia)
        }else{
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    }catch(error){
        next(error)
    }
    

})


// deleteMedia

mediaRouter.delete("/:imdbID", (req,res,next)=>{
    try{

        const media = getMedia()
        const mediaToDelete = media.find(m=> m.imdbID === req.params.imdbID)
        if(mediaToDelete){
            
                const filteredMedia = media.filter(m=> m.imdbID !== req.params.imdbID)
                fs.writeFileSync(mediaFilePath, filteredMedia)
                res.status(200).send("media deleted")
    
      }else{
        const error = new Error("media not found")
        error.httpStatusCode = 404
        next(error)
    }
   
        
    }catch(error){
        next(error)
    }
})









 module.exports = mediaRouter