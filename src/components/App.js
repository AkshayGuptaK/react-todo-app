import React from "react"
import {hot} from "react-hot-loader"
import "../App.css"
import InputField from "./InputField"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {lists: []}
    this.addList = this.addList.bind(this)
    this.addListSuccess = this.addListSuccess.bind(this)
  }
  addList (name) {
    console.log('Submitting post request')
    fetch("http://localhost:8080/list/" + name, {
      method: 'POST',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.addListSuccess(res.id, name))
  }
  addListSuccess (id, name) {
    this.setState({lists: this.state.lists.concat([{ 'id': id, 'name': name, 'tasks': [] }])})
  }
  componentDidMount() {
    console.log('Submitting get request')
    fetch("http://localhost:8080/all", {
      method: 'GET',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({lists: res}))
  }
  render() {
    return(
      <div>
        <h1>Carpe Diem</h1>
        <ListInput submit={this.addList}></ListInput>
        <div id="inputDivider" className="divider"></div>
        <div>
        {this.state.lists.map(list => 
          {return <List key={list.id} id={list.id} name={list.name} tasks={list.tasks}></List>})}
        </div>
      </div>
    )
  }
}

class ListInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'name': ''}
    this.addList = this.addList.bind(this)
  }
  addList (event) {
    event.preventDefault()
    if ( !/\S+/.test(this.state.name) ) {
      alert('Please enter a list name')
    } else {
      this.props.submit(this.state.name)
      this.setState({'name':''})
    }
  }
  render() {
    return(
      <form>
        <InputField id='inputTaskName' value={this.state.name} update={(value)=>{this.setState({'name': value})}}></InputField>
        <button id='addlist' onClick={this.addList}></button>
      </form>
    )
  }
}

class List extends React.Component {
  deleteList() {
    //delete list call and method
  }
  render() {
    return(
      <div>
        <h2>{this.props.name}</h2>
        <ul>
          {this.props.tasks.filter(x => !x.completed).map(task => {return <li key={task.id}>{task.name}</li>})}
        </ul>
        <completedTasksMessage completedTasks={this.props.tasks.filter(x => x.completed).length}></completedTasksMessage>
        <button className='deleteButton' onClick={this.deleteList}></button>
      </div>
    ) // onclick method needed
  }
}

function completedTasksMessage (props) {
  if (props.completedTasks > 0) {
    return <p>{props.completedTasks} tasks completed</p>
  } return <p></p>
}

export default hot(module)(App)