import React from 'react';

class ChannelHeader extends React.Component{
  constructor(props){
    super(props);
  }


  handleLeft(){
    // console.log("handle left")
    this.props.toggleDrawers(0);
  }

  handleRight(){
    // console.log("handle right")
    this.props.toggleDrawers(1);
  }


  render(){
    return(
      <div className="chatbox-header">
        <i onClick={this.handleLeft.bind(this)} className="fa fa-bars fa-2x header-button" aria-hidden="true"></i>
        <h1>Header and stuff here</h1>
        <i onClick={this.handleRight.bind(this)} className="fa fa-user fa-2x header-button" aria-hidden="true"></i>
      </div>
    );
  }
}

export default ChannelHeader;
