const express = require('express')
const controllers = require('/controllers.js')
var router = express.Router()

/* GET all data */
router.get('/all', controllers.getAllData)

/* GET all task data of a list */
router.get('/list/:listId', controllers.getAllTasks)

/* POST new list */
router.post('/list/:name', controllers.addList)

/* PUT list name edit */
router.put('/list/:listId/:name', controllers.editList)

/* DELETE list */
router.delete('/list/:listId', controllers.deleteList)

/* POST new task */
router.post('/task/:listId/:name/:desc', controllers.addTask)

/* PUT task edit */
router.put('/task/:taskId/:field/:value', controllers.editTask)

/* DELETE a task */
router.delete('/task/:listId/:taskId', controllers.deleteTask)

module.exports = router
