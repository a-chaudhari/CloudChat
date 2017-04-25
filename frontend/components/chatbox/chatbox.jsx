import React from 'react';
import UserBox from './userbox';
import ServerList from './serverList';
import ChatContent from './chatContent';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.connect_websocket();
  }

  render(){
    return(
      <div className="chatbox-container">
        <div className="chatbox-left">
          <UserBox logOut={this.props.logOut}/>
          <ServerList/>
        </div>
        <ChatContent selectedRoom={this.props.selectedRoom}/>
      </div>
    );
  }
}

export default ChatBox;
