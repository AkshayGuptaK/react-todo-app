const redis = require('redis')
const util = require('util')
var client = redis.createClient()

function parseBool (str) {
  if (str === 'true') {
    return true
  } return false
}

function formatData (objects, ids) {
  for (let i=0; i<objects.length; i++) {
    objects[i]['id'] = parseInt(ids[i])
    objects[i]['completed'] = parseBool(objects[i]['completed'])
  }
  console.log(objects)
  return objects
}

function taskListId (id) {
  return 'tasks:' + id
}

exports.getAllData = function (req, res) {
  console.log('I got a get request')
}

exports.addList = function (req, res) {
  console.log('I got a post request')
  client.incr('index', function(err, id) {
    if (err) {
      console.log('error is', err)
      res.send(err)
    } else {
      client.lpush('lists', id, function(err, success) {
        if (err) {
          console.log('error is', err)
          res.send(err)
        } else {
          client.hmset(id, 'name', req.params.name, function(err, success) {
            if (err) {
              res.send(err)
              console.log('error is', err)
            } else {
              console.log('id is', id)
              res.send({'id': id})
            }
          })
        }
      })
    }
  })
}

exports.editList = function (req, res) {
  console.log('I got an edit request')
  client.hset(req.params.listId, 'name', req.params.name, function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      res.send()
    }
  })
}

exports.deleteList = function (req, res) {
  console.log('I got a delete request')
  client.hdel(req.params.listId, 'name', function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      client.lrem('lists', 1, req.params.listId)
      console.log('List deleted')
      res.send({'successes': result})
    }
  })
}

exports.getAllTasks = function (req, res) {
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
}

exports.addTask = function (req, res) {
  console.log('I got a post request')
  client.incr('index', function(err, id) {
    if (err) {
      console.log('error is', err)
      res.send(err)
    } else {
      client.lpush(taskListId(req.params.listId), id, function(err, success) {
        if (err) {
          console.log('error is', err)
          res.send(err)
        } else {
          client.hmset(id, 'name', req.params.name, 'description', req.params.desc, 'completed', false, function(err, success) {
            if (err) {
              res.send(err)
              console.log('error is', err)
            } else {
              console.log('id is', id)
              res.send({'id': id})
            }
          })
        }
      })
    }
  })
}

exports.editTask = function (req, res) {
  console.log('I got an edit request')
  client.hset(req.params.taskId, req.params.field, req.params.value, function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      res.send()
    }
  })
}

exports.deleteTask = function (req, res) {
  console.log('I got a delete request')
  client.hdel(req.params.taskId, 'name', 'description', 'completed', function(err, result) {
    if (err) {
      res.send(err)
      console.log('error is', err)
    } else {
      client.lrem(taskListId(req.params.listId), 1, req.params.taskId)
      console.log('Task deleted')
      res.send({'successes': result})
    }
  })
}

client.on('connect', function() {
  console.log('Redis client connected')
})

client.on('error', function (err) {
  console.log('Error ' + err)
})
