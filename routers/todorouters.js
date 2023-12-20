var express = require('express');
var router = express.Router();
let todo= require('../controllers/todo');
router.get('/todos',todo.getTodo);
router.get('/todos/:id',todo.getTodoById);
router.delete('/todos/:id',todo.todoDelete);
router.put('/todos/:id',todo.updateTodo);
router.post('/todos',todo.createTodo);
router.post('/user',todo.createUsers);
module.exports = router;
