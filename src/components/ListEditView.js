import React from "react"
import {hot} from "react-hot-loader"
import Input from "./Input.js"
import Task from "./Task.js"

class ListEditView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tasks: []}
    this.addTask = this.addTask.bind(this)
    this.addTaskSuccess = this.addTaskSuccess.bind(this)
    this.delTask = this.delTask.bind(this)
    this.delTaskSuccess = this.delTaskSuccess.bind(this)
    this.completeTask = this.completeTask.bind(this)
    this.completeTaskSuccess = this.completeTaskSuccess.bind(this)
  }
  addTask (name, description) {
    console.log(this.state.tasks)
    console.log('Submitting post request')
    fetch("http://localhost:8080/task/" + this.props.id + '/' + name + '/' + description, {
      method: 'POST',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.addTaskSuccess(res.id, name, description))
  } // implement error handling
  addTaskSuccess(id, name, description) {
    console.log('Task added successfully')
    this.setState({tasks: this.state.tasks.concat([{'id': id, 'name': name, 'description': description, 'completed': false}])})
  }
  delTask (id) {
    console.log('Submitting delete request')
    fetch("http://localhost:8080/task/" + this.props.id + '/' + id, {
      method: 'DELETE',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.delTaskSuccess(id))
    // check for errors
  }
  delTaskSuccess (id) {
    this.setState({tasks: this.state.tasks.filter(x => x.id !== id)})
  }
  completeTask (id, completed) {
    console.log('Submitting put request')
    fetch("http://localhost:8080/task/" + id + '/completed/' + completed, {
      method: 'PUT',
      mode: "cors"
    }).then(res => this.completeTaskSuccess(id, completed))
  } // error checking
  completeTaskSuccess (id, completed) {
    let task = this.state.tasks.filter(x => x.id === id)
    task[0].completed = completed
    this.setState({tasks: this.state.tasks.filter(x => x.id !== id).concat(task)})
  }
  componentDidMount() {
    console.log('Submitting get request')
    fetch("http://localhost:8080/allTasks", {
      method: 'GET',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({tasks: res}))
    // check for errors
  }
  render() {
    return(
      <div className="App">
        <h1>Carpe Diem</h1>
        <Input submit={this.addTask}></Input>
        <div id="inputDivider" className="divider"></div>
        {this.state.tasks.filter(x => !x.completed).map(task => 
          {return <Task key={task.id} id={task.id} name ={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask}></Task>})}
        <div id="completeDivider" className="divider"></div>
        <h2>Completed</h2>
        {this.state.tasks.filter(x => x.completed).map(task => 
          {return <Task key={task.id} id={task.id} name={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask}></Task>})}
      </div>
    )
  }
}

export default hot(module)(ListEditView)