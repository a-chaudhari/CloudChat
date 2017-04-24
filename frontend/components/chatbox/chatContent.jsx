import React from 'react';
import ChannelHeader from './channel_header';
import ChannelMessages from './channel_messages';
import ChannelMemberList from './channel_memberlist';
import ChannelInput from './channel_input';

class ChatContent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="chatbox-content">
        <ChannelHeader selectedRoom={this.props.selectedRoom}/>
        <div className="chatbox-lower">
          <div className="chatbox-msgs-input">
            <ChannelMessages/>
            <ChannelInput/>
          </div>
          <ChannelMemberList/>
        </div>
      </div>
    );
  }
}


export default ChatContent;
