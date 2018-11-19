import React from "react"
import {hot} from "react-hot-loader"
import "./App.css"

class App extends React.Component {
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
    fetch("http://localhost:8080/newTask", {
      method: 'POST',
      mode: "cors",
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({'name': name, 'description': description})
    }).then(res => res.json())
    .then(res => this.addTaskSuccess(res.id, name, description))
  } // implement error handling
  addTaskSuccess(id, name, description) {
    console.log('Task added successfully')
    this.setState({tasks: this.state.tasks.concat([{'id': id, 'name': name, 'description': description, 'completed': false}])})
  }
  delTask (id) {
    console.log('Submitting delete request')
    fetch("http://localhost:8080/delTask", {
      method: 'DELETE',
      mode: "cors",
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({'id': id})
    }).then(res => res.json())
    .then(res => this.delTaskSuccess(id))
    // check for errors
  }
  delTaskSuccess (id) {
    this.setState({tasks: this.state.tasks.filter(x => x.id !== id)})
  }
  completeTask (id, completed) {
    console.log('Submitting put request')
    fetch("http://localhost:8080/editTask", {
      method: 'PUT',
      mode: "cors",
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({'id': id, 'field': 'completed', 'value': completed})
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
        {this.state.tasks.filter(x => !x.completed).map(task => {return <Task key={task.id} id={task.id} name={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask}></Task>})}
        <div id="completeDivider" className="divider"></div>
        <h2>Completed</h2>
        {this.state.tasks.filter(x => x.completed).map(task => {return <Task key={task.id} id={task.id} name={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask}></Task>})}
      </div>
    )
  }
}

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'name': '', 'description': ''}
    this.addTask = this.addTask.bind(this)
  }
  addTask (event) {
    event.preventDefault()
    if ( !/\S+/.test(this.state.name) ) {
      alert('Please enter a task name')
    } else {
      this.props.submit(this.state.name, this.state.description)
      this.setState({'name':'', 'description':''})
    }
  }
  render() {
    return(
      <form>
      <InputField id='inputTaskName' value={this.state.name} update={(value)=>{this.setState({'name': value})}}></InputField>
      <InputField id='inputTaskDescription' value={this.state.description} update={(value)=>{this.setState({'description': value})}}></InputField>
      <button id='addtask' onClick={this.addTask}></button>
      </form>
    )
  }
}

class InputField extends React.Component {
  render() {
    return(
      <input
      type='text' 
      id={this.props.id} 
      value={this.props.value} 
      onChange={(e)=>{this.props.update(e.target.value)}}>
      </input>
    )
  }
}

class Task extends React.Component {
  constructor (props) {
    super(props) // contains id, name, desc, completed, completeAction, deleteAction
    this.delTask = this.delTask.bind(this)
    this.completeTask = this.completeTask.bind(this)
  }
  delTask() {
    this.props.deleteAction(this.props.id)
  }
  completeTask() {
    console.log('Complete a Task clicked') // debug
    this.props.completeAction(this.props.id, !this.props.completed)
  }
  render() {
    return(
      <div className='task'>
      <EditField class='taskname' value={this.props.name} btnOnClass='acceptNameEditBtn' btnOffClass='editBtn'> submitFunc={}</EditField>
      <EditField class='taskdesc' value={this.props.desc} btnOnClass='acceptDescEditBtn' btnOffClass='describeBtn'> submitFunc={}</EditField>
      <ToggleBtn condition={this.props.completed} onClass='incompleteBtn' offClass='completeBtn' clickAction={this.completeTask}></ToggleBtn>
      <button className='deleteBtn' onClick={this.delTask}></button>
      </div>
    )
  }
}

class EditField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: props.value, editOn: false}
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    if (this.state.editOn) {
      //put request of some props type using this.state.value
    }
    this.setState({editOn: !this.state.editOn})
  }
  render() {
    return(
      <React.Fragment>
      <input type='text' className={this.props.class} disabled={!this.state.editOn} value={this.state.value} onChange={(e)=>{this.setState({value: e.target.value})}}></input>
      <ToggleBtn condition={this.state.editOn} onClass={this.props.btnOnClass} offClass={this.props.btnOffClass} clickAction={this.handleClick}></ToggleBtn>
      </React.Fragment>
    )
  }
}

function ToggleBtn (props) {
  if (props.condition) {
    // console.log('Button on', props.onClass)
    return <button className={props.onClass} onClick={props.clickAction}></button>
  }     // console.log('Button off', props.offClass)
  return <button className={props.offClass} onClick={props.clickAction}></button>
}

export default hot(module)(App)