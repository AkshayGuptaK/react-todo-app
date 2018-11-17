const express = require('express')
const redis = require('redis')
var router = express.Router()
var client = redis.createClient()

/* GET all task data */
router.get('/allTasks', function() {
  console.log('I got a get request')
  let tasks = []
  client.get('tasks', function(err, res) {
    if (err) {
      // res.send(err)
    } else {
      console.log(res) // debug
      for (id of res) {
        console.log(id) // debug
        client.hgetall(id, function(err, res) {
          if (err) {
            res.send(err)
          } else {
            console.log(res) // debug
            tasks.push(res)
          }
        })
      }
      res.send(tasks) // need to send this after the for loop reqs have completed    
    }
  })
})

/* POST new task */
router.post('/newTask', function(req, res) {
  console.log('I got a post request')
  let name = req.body.name
  let description = req.body.description
  client.incr('taskID', function(err, result) {
    if (err) {
      console.log('error is', err)
      res.send(err)
    } else {
      client.lpush('tasks', result, function(err, success) {
        if (err) {
          console.log('error is', err)
          res.send(err)
        } else {
          client.hmset(result, 'name', name, 'description', description, 'completed', false, function(err, success) {
            if (err) {
              res.send(err)
              console.log('error is', err)
            } else {
              console.log('id is', result)
              res.send({'id':result})
            }
          })
        }
      })
    }
  })
})

/* PUT task edit */
router.put('/editTask', function(req, res) {
  console.log('I got a edit request')
  let id = req.body.id
  let field = req.body.field
  let value = req.body.value
  client.hset(id, field, value, function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      res.send(result)
    }
  })
})

/* DELETE a task */
router.delete('/delTask', function(req, res) {
  console.log('I got a delete request')
  let id = req.body.id
  client.hdel(id, 'name', 'description', 'completed', function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      // remove task from task ids list
      console.log('Task deleted')
      res.send({'successes': result})
    }
  })
})

module.exports = router

  
  // use AOF persistence
client.on('connect', function() {
      console.log('Redis client connected')
      //console.log(client.hgetall(b))
      
      //client.quit()
})

client.on('error', function (err) {
      console.log('Error ' + err)
})
