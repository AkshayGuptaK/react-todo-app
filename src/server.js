const express = require('express')
const cors = require('cors')

var config = require('../config')
var router = require('./routes')

var server = express()
server.listen(config.port, function () {
  console.log(`Server listening on port ${config.port}`)
})
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(express.static(config.publicDir))
server.use('/', router)

// error handler
server.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.server.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
