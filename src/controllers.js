const redis = require('redis')
const util = require('util')

const client = redis.createClient()
const hgetall = util.promisify(client.hgetall).bind(client)
const lrange = util.promisify(client.lrange).bind(client)

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

function formatTaskData (objects, ids) {
  for (let i=0; i<objects.length; i++) {
    objects[i]['id'] = parseInt(ids[i])
    objects[i]['completed'] = parseBool(objects[i]['completed'])
  }
  return objects
}

function formatListData (names, tasks, ids) {
  return names.map((list, index) => { return { 'name': list.name, 'id': ids[index], 'tasks': tasks[index]}})
}

async function getTasksOfList (listId) {
  let ids = await lrange(taskListId(listId), 0, -1)
  let tasks = await Promise.all(ids.map(id => hgetall(id)))
  return formatTaskData(tasks, ids)
} // error handling

// Exported Controllers

exports.getAllData = async function (req, res) {
  console.log('I got a get request')
  let ids = await lrange('lists', 0, -1)
  let listNames = await Promise.all(ids.map(id => hgetall(id)))
  let listTasks = await Promise.all(ids.map(id => getTasksOfList(id)))
  res.send(formatListData(listNames, listTasks, ids))
} // error handling

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

exports.addTask = function (req, res) {
  console.log('I got a post request')
  if (!req.params.desc) {
    req.params.desc = ''
  }
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
