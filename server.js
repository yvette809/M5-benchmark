const express = require("express")
const server = express()
const cors = require("cors")
const mediaRouter = require("./src/services/media")
const reviewsRouter = require("./src/services/reviews")
const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./src/errorHandler")

server.use(cors())
server.use(express.json()) 

server.use("/media",mediaRouter )
server.use("/reviews", reviewsRouter)









port = process.env.PORT || 3000
server.listen(port, ()=>[
    console.log(`server is running on port ${port}`)
])