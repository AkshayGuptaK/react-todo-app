import React from "react"
import {hot} from "react-hot-loader"
import "../App.css"

class App extends React.Component {
  addList (name) {
    //POST call to db
  }
  componentDidMount() {
    //GET call
  }
  render() {
    return(
      <div>
        <h1>Carpe Diem</h1>
        <ListInput submit={this.addList}></ListInput>
        <div id="inputDivider" className="divider"></div>
        <div>
          <List name={} tasks={}></List>
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
  render() {
    return(
      <div>
      <h2>{this.props.name}</h2>
      <ul>
        {this.props.tasks.filter(x => !x.completed).map(task => {return <li key={task.id}>{task.name}</li>})}
      </ul>
      <p>{this.props.tasks.filter(x => x.completed).length} tasks completed</p>
      </div>
    ) // onclick method needed
  }
}

export default hot(module)(App)