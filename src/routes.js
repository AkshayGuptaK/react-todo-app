const express = require('express')
const controllers = require('./controllers')
var router = express.Router()

/* GET all data */
router.get('/all', controllers.getAllData)

/* POST new list */
router.post('/list/:name', controllers.addList)

/* PUT list name edit */
router.put('/list/:listId/:name', controllers.editList)

/* DELETE list */
router.delete('/list/:listId', controllers.deleteList)

/* POST new task */
router.post('/task/:listId/:name/', controllers.addTask)
router.post('/task/:listId/:name/:desc', controllers.addTask)

/* PUT task edit */
router.put('/task/:taskId/:field/:value', controllers.editTask)

/* DELETE a task */
router.delete('/task/:listId/:taskId', controllers.deleteTask)

module.exports = router
