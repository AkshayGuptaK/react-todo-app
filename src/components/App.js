import React from "react"
import {hot} from "react-hot-loader"
import "../App.css"
import InputField from "./InputField"
import ListEditView from "./ListEditView"

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {lists: [], multiView: true, selected: {}}
    this.addList = this.addList.bind(this)
    this.deleteList = this.deleteList.bind(this)
    this.changeView = this.changeView.bind(this)
    this.returntoView = this.returntoView.bind(this)
  }
  addList (name) {
    console.log('Submitting post request')
    fetch("http://localhost:8080/list/" + name, {
      method: 'POST',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({lists: this.state.lists.concat([{ 'id': res.id, 'name': name, 'tasks': [] }])}))
  }
  deleteList (id) {
    console.log('Submitting delete request')
    fetch("http://localhost:8080/list/" + id, {
      method: 'DELETE',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({lists: this.state.lists.filter(x => x.id !== id)}))
    // check for errors
  }
  changeView (id) {
    this.setState({multiView: false, selected: this.state.lists.filter(x => x.id === id)[0]})
  }
  returntoView (id, tasks) {
    console.log('Letsura return!') // debug
    let list = this.state.lists.filter(x => x.id === id)
    list[0].tasks = tasks
    this.setState({multiView: true, selected: {}, lists: this.state.lists.filter(x => x.id !== id).concat(list)})
  }
  componentDidMount() {
    console.log('Submitting get request')
    fetch("http://localhost:8080/all", {
      method: 'GET',
      mode: "cors"
    }).then(res => res.json())
    .then(res => this.setState({lists: res}, () => console.log(this.state.lists))) // debug
  }
  render() {
    return(
      <div>
        {this.state.multiView ? (
          <div>
            <h1>Carpe Diem</h1>
            <ListInput submit={this.addList}></ListInput>
            <div id="inputDivider" className="divider"></div>
            <div className='listContainer'>
              {this.state.lists.map(list => 
                {return <List key={list.id} id={list.id} name={list.name} tasks={list.tasks} delete={this.deleteList} select={this.changeView}></List>})}
            </div>
          </div>
        ) : (
          <ListEditView id={this.state.selected.id} name={this.state.selected.name} tasks={this.state.selected.tasks} return={this.returntoView}></ListEditView>
        )}
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
  constructor (props) {
    super(props)
    this.deleteList = this.deleteList.bind(this)
    this.editList = this.editList.bind(this)
  }
  deleteList() {
    this.props.delete(this.props.id)
  }
  editList() {
    this.props.select(this.props.id)
  }
  render() {
    return(
      <div className='todoList' onClick={this.editList}>
        <h2>{this.props.name}</h2>
        <ul>
          {this.props.tasks.filter(x => !x.completed).map(task => {return <li key={task.id}>{task.name}</li>})}
        </ul>
        <CompletedTasksMessage completedTasks={this.props.tasks.filter(x => x.completed).length}></CompletedTasksMessage>
        <button className='listDeleteBtn' onClick={this.deleteList}></button>
      </div>
    ) // onclick method needed
  }
}

function CompletedTasksMessage (props) {
  if (props.completedTasks > 0) {
    return <p>{props.completedTasks} tasks completed</p>
  } return <p></p>
}

export default hot(module)(App)