import React from "react"
import {hot} from "react-hot-loader"

import "../App.css"
import ListInput from "./ListInput"
import List from "./List"
import ListEditView from "./ListEditView"
import fetchRequests from "../fetch"

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {lists: [], selectedList: null}
    this.addList = this.addList.bind(this)
    this.deleteList = this.deleteList.bind(this)
    this.changeView = this.changeView.bind(this)
    this.returntoView = this.returntoView.bind(this)
  }
  componentDidMount() { // get all list data
    fetchRequests.getAllData().then(res => this.setState({lists: res}))
  }
  addList (name) { // add a new to-do list
    fetchRequests.createList(name)
    .then(res => this.setState({lists: this.state.lists.concat([{ "id": res.id, "name": name, "tasks": [] }])}))
  }
  deleteList (id) { // delete existing to-do list
    fetchRequests.deleteList(id)
    .then(res => this.setState({lists: this.state.lists.filter(x => x.id !== id)}))
  }
  changeView (id) {  // change to single list view
    this.setState({selectedList: id})
  }
  returntoView (id, name, tasks) { // return to multi list view
    let newLists = this.state.lists
    let list = newLists.filter(x => x.id === id)[0]
    list.name = name
    list.tasks = tasks
    this.setState({selectedList: null, lists: newLists})
  }
  render() {
    return(
      <div>
        {this.state.selectedList ? (
          <ListEditView id={this.state.selectedList}
            name={this.state.lists.filter(x => x.id === this.state.selectedList)[0].name}
            tasks={this.state.lists.filter(x => x.id === this.state.selectedList)[0].tasks}
            return={this.returntoView}>
          </ListEditView>
        ) : (
          <div>
            <h1>Carpe Diem</h1>
            <ListInput submit={this.addList}></ListInput>
            <div id="inputDivider" className="divider"></div>
            <div className="listContainer">
              {this.state.lists.map(list => 
                {return <List key={list.id} id={list.id} name={list.name} tasks={list.tasks} delete={this.deleteList} select={this.changeView}></List>})}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default hot(module)(App)