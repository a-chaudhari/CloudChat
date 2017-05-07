import React from 'react';
import Linkify from 'linkifyjs/react';

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
    let server = "(none selected)";
    let channel = "(none selected)";
    let topic = "(no channel topic)";
    let header = null;
    if(this.props.selectedRoom !== null){
      const room = this.props.selectedRoom;
      const chunks = room.split(' ');
      server = chunks[0];
      channel = chunks[1];
      topic = this.props.servers[server].channels[channel].topic;
      if(topic === "") topic = "(no channel topic)";
    }

    if(this.props.mobile){
      return (
        <div className="chatbox-header">
          <i onClick={this.handleLeft.bind(this)}
             className="fa fa-bars fa-2x header-button" aria-hidden="true"></i>
          <h1>{channel}</h1>
          <i onClick={this.handleRight.bind(this)}
             className="fa fa-user fa-2x header-button" aria-hidden="true"></i>
        </div>);
    }else{
       return (
        <div className="chatbox-header">
          <h1>{topic}</h1>
        </div>
      );
    }
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
