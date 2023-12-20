const express = require("express");
const router = express.Router();
const connection = require("../db");
var cors = require("cors");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
let app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//############CREATE TODO#############
let createTODOdata = (title, description, completed, created_at) => {
    return new Promise((resolve, reject) => {
      var sql ="insert into Todo(title,description,completed,created_at) values(?,?,?,?)";
      connection.query(sql,
        [title, description, completed, created_at],
        (err, results) => {
          if (err) { return reject(err);
          } else {return resolve(results)}
      });
    });
  };
  async function createTodo(req, res) {
    try {
      let title = req.body.title;
      let description = req.body.description;
      let completed = req.body.completed;
      let created_at = new Date();
      await createTODOdata(title, description, completed, created_at);
      return res.json({
        status: true,
        messsage: "TODO CREATED SUCCESSFULLY",
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  //############LIST OF TODO#############
  let getTodoList = () => {
    return new Promise((resolve, reject) => {
      var sql = "select * from Todo";
      connection.query(sql, [], (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  };
  async function getTodo(req, res) {
    try {
      let getListOfTodo = await getTodoList();
      return res.json({
        status: true,
        messsage: "TODO Fetched SUCCESSFULLY",
        data: getListOfTodo,
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  //############GET TODO BY ID#############
  let TodoById = (id) => {
    return new Promise((resolve, reject) => {
      var sql = "select * from Todo where id=?";
      connection.query(sql, [id], (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  };async function getTodoById(req, res) {
    try {
      let getListByIdRes = await TodoById(req.params.id);
      return res.json({
        status: true,
        messsage: "TODO Fetched SUCCESSFULLY",
        data: getListByIdRes,
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  //############DELETE TODO BY ID#############
  let deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
      var sql = "delete from Todo where id=?";
      connection.query(sql, [id], (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  };
  async function todoDelete(req, res) {
    try {
      await deleteTodo(req.params.id);
      return res.json({
        status: true,
        messsage: "Todo Deleted Successfully",
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  //############UPDATE TODO BY ID#############
  let updateTodoById = (title, description, completed, id) => {
    return new Promise((resolve, reject) => {
      var sql = "update Todo set title=?,description=?,completed=? where id=?";
      connection.query(
        sql,
        [title, description, completed, id],
        (err, results) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(results);
          }
        }
      );
    });
  };async function updateTodo(req, res) {
    try {
      let id = req.params.id;
      let title = req.body.title;
      let description = req.body.description;
      let completed = req.body.completed;
      await updateTodoById(title, description, completed, id);
      return res.json({
        status: true,
        messsage: "Todo Updated Successfully",
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  //############CHECK EMIAL VALIDATAION FOR USERNAME#############
  const emailCheck = (email) => {
    return new Promise((resolve, reject) => {
      var sql = "select * from Users where email=?";
      connection.query(sql, [email], (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  }
  //############CHECK USERNAME VALIDATAION FOR USER#############
  const usernameCheck = (username) => {
    return new Promise((resolve, reject) => {
      var sql = "select * from Users where username=?";
      connection.query(sql, [username], (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  };let createUserdata = (username, password, email, created_at, updated_at) => {
    return new Promise((resolve, reject) => {
      var sql =
        "insert into Users(username, password, email, created_at, update_at) values(?,?,?,?,?)";
      connection.query(
        sql,
        [username, password, email, created_at, updated_at],
        (err, results) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(results);
          }
        }
      );
    });
  };
//############CHECK USER#############
  async function createUsers(req, res) {
    try {
      let data = req.body;
      data.created_at = new Date();
      data.updated_at = new Date();
      const Hashpassword = hashSync(data.password, 10);
      data.password = Hashpassword;
      let emailCheck1 = await emailCheck(data.email.trim().toLowerCase());
      let usernameCheck1 = await usernameCheck(data.username.trim().toLowerCase());
      console.log("user",usernameCheck1)
      if(emailCheck1.length!=0){
        return res.json({
          status:false,
          message:"Email Already Exits"
        })
    }
      else if(usernameCheck1.length !=0){
        return res.json({
          status:false,
          message:"User Name Already Exits"
        })
  
      }

      await createUserdata(
        data.username,
        data.password,
        data.email,
        data.created_at,
        data.updated_at
      );
      return res.json({
        status: true,
        message: "USER INSERTED SUCCESSFULLY",
      });
    } catch (error) {
      console.log("error",error);
      return res.json({
        status: false,
        message: "Error",
      });
    }
  }
  module.exports.createUsers = createUsers
  module.exports.updateTodo = updateTodo
  module.exports.todoDelete = todoDelete
  module.exports.getTodoById = getTodoById
  module.exports.getTodo = getTodo;
  module.exports.createTodo = createTodo;
