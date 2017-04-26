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
    if(this.props.selectedRoom === null){
      return(
        <div className="chatbox-header"></div>
      )
    }

    const room = this.props.selectedRoom;
    let header = null;
    const chunks = room.split(' ');
    const server = chunks[0];
    const channel = chunks[1];
    let topic = this.props.servers[server].channels[channel].topic;
    if(topic === "") topic = "(none)";

    if(this.props.mobile){
      header = (
        <div className="chatbox-header">
          <i onClick={this.handleLeft.bind(this)} className="fa fa-bars fa-2x header-button" aria-hidden="true"></i>
          <h1>{channel}</h1>
          <i onClick={this.handleRight.bind(this)} className="fa fa-user fa-2x header-button" aria-hidden="true"></i>
        </div>)
    }else{
      header = (
        <div className="chatbox-header">
          <h1><span>Topic:</span> {topic}</h1>
        </div>
      )
    }


    return header;
  }
}



import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      selectedRoom: state.config.selectedRoom,
      toggleDrawers: ownProps.toggleDrawers,
      mobile: state.config.mobile,
      servers: state.config.servers
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {

    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelHeader);
