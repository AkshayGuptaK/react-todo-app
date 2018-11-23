import React from "react"
import TaskInput from "./TaskInput"
import Task from "./Task"

class ListEditView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: this.props.name, tasks: this.props.tasks}
    this.addTask = this.addTask.bind(this)
    this.delTask = this.delTask.bind(this)
    this.completeTask = this.completeTask.bind(this)
    this.completeTaskSuccess = this.completeTaskSuccess.bind(this)
    this.applyChanges = this.applyChanges.bind(this)
    this.changeView = this.changeView.bind(this)
    this.editName = this.editName.bind(this)
  }
  addTask (name, description) { // add a new task to this list
    console.log('Submitting post request', this.props.id, name, description) // debug
    fetch("http://localhost:8080/task/" + this.props.id + '/' + name + '/' + description, {
      method: 'POST',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({tasks: this.state.tasks.concat([{'id': res.id, 'name': name, 'description': description, 'completed': false}])}))
  } // implement error handling
  delTask (id) { // delete an existing task
    console.log('Submitting delete request')
    fetch("http://localhost:8080/task/" + this.props.id + '/' + id, {
      method: 'DELETE',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({tasks: this.state.tasks.filter(x => x.id !== id)}))
    // check for errors
  }
  completeTask (id, completed) { // send db request to modify task completion status
    console.log('Submitting put request')
    fetch("http://localhost:8080/task/" + id + '/completed/' + completed, {
      method: 'PUT',
      mode: "cors"
    }).then(res => this.completeTaskSuccess(id, completed))
  } // error checking
  completeTaskSuccess (id, completed) { // modify task completion in state to match db
    let task = this.state.tasks.filter(x => x.id === id)
    task[0].completed = completed
    this.setState({tasks: this.state.tasks.filter(x => x.id !== id).concat(task)})
  }
  applyChanges (id, field, value) { // modify state of task to match db
    let newTasks = this.state.tasks
    newTasks.filter(x => x.id === id)[0][field] = value
    this.setState({tasks: newTasks})
  }
  changeView () { // return to multi list view
    this.props.return(this.props.id, this.state.name, this.state.tasks)
  }
  editName (event) { // keep db and local field containing list name in sync
    console.log('Submitting put request')
    let newName = event.target.value
    fetch("http://localhost:8080/list/" + this.props.id + '/' + newName, {
      method: 'PUT',
      mode: "cors"
    }).then(res => this.setState({name: newName}))
  } // error checking
  render() {
    return(
      <div className="App">
        <button id='returnBtn' onClick={this.changeView}></button>
        <input value={this.state.name} id='ListName' onChange={this.editName}></input>
        <TaskInput submit={this.addTask}></TaskInput>
        <div id="inputDivider" className="divider"></div>
        {this.state.tasks.filter(x => !x.completed).length > 0 ?
          (this.state.tasks.filter(x => !x.completed).map(task => 
            {return <Task key={task.id} id={task.id} name ={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask} apply={this.applyChanges}></Task>})
          ) : <p className='emptymsg'>Twiddling my thumbs, nothing to do.</p>}
        <div id="completeDivider" className="divider"></div>
        <h2>Completed</h2>
        {this.state.tasks.filter(x => x.completed).map(task => 
          {return <Task key={task.id} id={task.id} name={task.name} desc={task.description} completed={task.completed} completeAction={this.completeTask} deleteAction={this.delTask} apply={this.applyChanges}></Task>})}
      </div>
    )
  }
}

export default ListEditView