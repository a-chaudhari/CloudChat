import React from 'react';
import UserBox from './userbox';
import ServerList from './serverList';
import ChatContent from './chatContent';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="chatbox-container">
        <div className="chatbox-left">
          <UserBox/>
          <ServerList/>
        </div>
        <ChatContent/>
      </div>
    );
  }
}

export default ChatBox;
