const express = require('express')
const redis = require('redis')
const util = require('util')
var router = express.Router()
var client = redis.createClient()

function parseBool(str) {
  if (str === 'true') {
    return true
  } return false
}

function formatData(objects, ids) {
  for (let i=0; i<objects.length; i++) {
    objects[i]['id'] = parseInt(ids[i])
    objects[i]['completed'] = parseBool(objects[i]['completed'])
  }
  console.log(objects)
  return objects
}

/* GET all task data */
router.get('/allTasks', function(req, res) {
  console.log('I got a get request')
  let tasks = []
  client.lrange('tasks', 0, -1, function(err, ids) {
    if (err) {
      res.send(err)
    } else {
      for (id of ids) {
        const hgetall = util.promisify(client.hgetall).bind(client)
        let task = hgetall(id)
        tasks.push(task)
      }
      Promise.all(tasks).then(values => res.send(formatData(values, ids)))
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
      res.send()
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
      client.lrem('tasks', 1, id)
      console.log('Task deleted')
      res.send({'successes': result})
    }
  })
})

module.exports = router

client.on('connect', function() {
      console.log('Redis client connected')
      //client.quit()
})

client.on('error', function (err) {
      console.log('Error ' + err)
})
