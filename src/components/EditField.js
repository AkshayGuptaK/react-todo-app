import React from 'react'

import ToggleBtn from './ToggleButton'

class EditField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: props.value, editOn: false}
  }
  handleClick = (event) => {
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

export default EditField