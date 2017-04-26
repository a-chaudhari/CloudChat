import React from 'react';
import UserBox from './userbox';
import ServerList from './serverList';
import ChatContent from './chatContent';
import ChannelMemberList from './channel_memberlist';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showLeft:false,
      showRight:false
    }
  }

  componentDidMount(){
    this.props.connect_websocket();
  }

  toggleDrawers(val){
    if(val === 0){
      this.setState({showLeft: !this.state.showLeft, showRight: false});
    }
    else if(val === 1){
      this.setState({showRight: !this.state.showRight, showLeft: false});
    }
  }

  render(){
    return(
      <div className="chatbox-container">
        <div className={"chatbox-left" + (this.state.showLeft ? "" : " hidden")}>
          <UserBox logOut={this.props.logOut}/>
          <ServerList/>
        </div>
        <ChatContent toggleDrawers={this.toggleDrawers.bind(this)} selectedRoom={this.props.selectedRoom}/>
        <ChannelMemberList show={this.state.showRight}/>
      </div>
    );
  }
}

export default ChatBox;
