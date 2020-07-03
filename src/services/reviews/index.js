const express = require ("express")
const fs = require ("fs")
const path = require("path")
const uniqid = require ("uniqid")
const{check,validationResult, sanitizeBody} = require("express-validator")

 const reviewsRouter = express.Router()

 const reviewsFilePath = path.join(__dirname, "reviews.json")
 const getReviews = () =>{
     const reviewsFileBuffer = fs.readFileSync(reviewsFilePath)
     const reviewsString = reviewsFileBuffer.toString()
     const reviews = JSON.parse(reviewsString)
     return reviews

 }

 // get all reviews
 reviewsRouter.get("/", (req,res,next)=>{
    try{
        const reviews = getReviews()
        if(reviews){
            res.status(200).send(reviews)
        }else{
            const error = new Error( "no media found")
            error.httpStatusCode = 404
            next(error)
        }

    }catch(error){
        next(error)
    }
     

 })

 // get reviews for a specific media
 reviewsRouter.get("/:_id", (req,res,next)=>{
     try{
        const reviews = getReviews()
        const singleReview = reviews.find(rev => rev._id === req.params._id)
        if(singleReview){
            res.status(200).send(singleReview)
        }else{
            const error = new Error("media not found")
            error.httpStatusCode = 404
            next(error)

        }

     }catch(error){
         next(error)
     }
         
 })

 //create a review (post)
 const validation = [
     check("elementId").exists().withMessage("you should specify the id"),
     check("comment").exists().withMessage("title is required").isLength({min: 4, max:100}),
     check("rate").exists().withMessage("rate is required"),
     sanitizeBody("rate").toInt()

 ]

 reviewsRouter.post("/", validation,(req,res,next)=>{
     const errors = validationResult(req)
     if(!errors.isEmpty){
         const error = new Error()
         error.httpStatusCode = 400
         error.message = errors
         next (error)
     }else{
         try{
            const reviews = getReviews()
            const newReview = {...req.body, _id : uniqid(), addedAt: new Date()}
             reviews.push(newReview)
            fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews))
            res.status(201).send(newReview)

         }catch(error){
             next(error)
         }
     }
 })

   
// edit Review

reviewsRouter.put("/:_id", (req,res,next)=>{
    try{
        const reviews = getReviews()
        const reviewFound = reviews.find(rev=> rev._id === req.params._id)
        if (reviewFound){
            const reviewsPosition = reviews.indexOf(reviews)
            const updatedReview = {...reviews, ...req.body}
            reviews[reviewsPosition] = updatedReview
            fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews))
            res.send(updatedReview)
        }else{
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    }catch(error){
        next(error)
    }
    

})


// deleteReview

reviewsRouter.delete("/:_id", (req,res,next)=>{
    try{

        const reviews = getReviews()
        const reviewToDelete = reviews.find(rev=> rev._id === req.params._id)
        if(reviewToDelete){
            
                const filteredReviews = reviews.filter(rev=> rev._id !== req.params._id)
                fs.writeFileSync(reviewsFilePath, JSON.stringify(filteredReviews))
                res.status(200).send("review deleted")
    
      }else{
        const error = new Error("media not found")
        error.httpStatusCode = 404
        next(error)
    }
   
        
    }catch(error){
        next(error)
    }
})









 












 module.exports = reviewsRouter