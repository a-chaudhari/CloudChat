import React from 'react';
import UserBox from './userbox';
import ServerList from './serverList';
import ChatContent from './chatContent';
import ChannelMemberList from './channel_memberlist';
import AddServer from './add_server';

class ChatBox extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showLeft: !this.props.mobile,
      showRight: !this.props.mobile
    };
  }

  componentDidMount(){
    this.props.connect_websocket();
  }

  componentWillReceiveProps(newProps){

    //handle resizing window
    if(this.props.mobile !== newProps.mobile){
      this.setState({showLeft: !newProps.mobile, showRight: !newProps.mobile});
    }

    //handle clicking on a channel
    if(this.props.selectedRoom !== newProps.selectedRoom && this.props.mobile){
      this.setState({showLeft: false, showRight: false});
    }
  }

  toggleDrawers(val){
    if(!this.props.mobile) return;

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
        <div className={"chatbox-left" +
                          (this.state.showLeft ? "" : " hidden")}>
          <UserBox logOut={this.props.logOut}/>
          <ServerList/>
          <AddServer socket={this.props.socket}/>
        </div>
        <ChatContent toggleDrawers={this.toggleDrawers.bind(this)}
                     selectedRoom={this.props.selectedRoom}/>
        <ChannelMemberList show={this.state.showRight}/>
      </div>
    );
  }
}

export default ChatBox;
