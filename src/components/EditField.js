import React from "react"

class EditField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: props.value, editOn: false}
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    if (this.state.editOn) {
      this.props.submitFunc(this.props.field, this.state.value)
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
    
function ToggleBtn (props) { // toggles between two button renders depending on condition
  if (props.condition) {
    return <button className={props.onClass} onClick={props.clickAction}></button>
  }
  return <button className={props.offClass} onClick={props.clickAction}></button>
}

export default EditField