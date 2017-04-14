import React from 'react';
import UserBox from './userbox';
import ServerList from './serverList';
import ChatContent from './chatContent';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedRoom: ""
    }
  }

  componentDidMount(){
    this.props.connect("abcd1234");
  }

  roomChangedCallBack(newChan){
    console.log(newChan);
    this.setState({selectedRoom: newChan})
  }

  render(){
    return(
      <div className="chatbox-container">
        <div className="chatbox-left">
          <UserBox/>
          <ServerList roomCallback={this.roomChangedCallBack.bind(this)}/>
        </div>
        <ChatContent selectedRoom={this.state.selectedRoom}/>
      </div>
    );
  }
}

export default ChatBox;
