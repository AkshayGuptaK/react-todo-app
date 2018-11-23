import React from "react"

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
    )
  }
}
  
function CompletedTasksMessage (props) {
  if (props.completedTasks > 0) {
    return <p>+ {props.completedTasks} tasks completed</p>
  } return <p></p>
}

export default List