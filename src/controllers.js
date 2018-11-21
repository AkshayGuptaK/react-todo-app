const redis = require('redis')
const util = require('util')
const client = redis.createClient()
const hgetall = util.promisify(client.hgetall).bind(client)

// Connection event handlers

client.on('connect', function() {
  console.log('Redis client connected')
})

client.on('error', function (err) {
  console.log('Error ' + err)
})

// Helper functions

function taskListId (id) {
  return 'tasks:' + id
}

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

function getAllTasksOfList (listId) {
  let tasks = []
  client.lrange(taskListId(listId), 0, -1, function(err, ids) {
    if (err) {
      res.send(err)
    } else {
      for (id of ids) {
        tasks.push(hgetall(id))
      }
      return Promise.all(tasks).then(values => formatData(values, ids))
    }
  })
}

// Exported Controllers

exports.getAllData = function (req, res) {
  console.log('I got a get request')
  let listNames = []
  let listTasks = []
  client.lrange('lists', 0, -1, function(err, ids) {
    if (err) {
      res.send(err)
    } else {
      for (id of ids) {
        listNames.push(hgetall(id))
        listTasks.push(getAllTasksOfList(id))
      }
      Promise.all([Promise.all(listNames), Promise.all(getAllTasksOfList)])
      .then(values => console.log(values)) // debug
    }
  })
}
//expected return is an array of list objects, each with a name and tasks property
//tasks property should hold an array of task objects

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
  client.lrange(taskListId(req.params.listId), 0, -1, function(err, ids) {
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
