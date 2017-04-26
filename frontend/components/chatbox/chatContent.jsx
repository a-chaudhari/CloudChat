import React from 'react';
import ChannelHeader from './channel_header';
import ChannelMessages from './channel_messages';
import ChannelInput from './channel_input';

class ChatContent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="chatbox-content">
        <ChannelHeader toggleDrawers={this.props.toggleDrawers}
                        selectedRoom={this.props.selectedRoom}/>
        <ChannelMessages/>
        <ChannelInput/>
      </div>
    );
  }
}


export default ChatContent;
