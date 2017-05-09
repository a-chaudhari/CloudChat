import React from 'react';

class ChannelInput extends React.Component{
  constructor(props){
    super(props);
    this.state={
      input:""
    };
  }

  update(field){
    return (e)=>(this.setState({[field]:e.target.value}));
  }

  processCommand(msg){
    const chunks = msg.split(' ');
    const command = chunks.shift();
    switch(command){
      case 'join':
        this.joinChannel(chunks[0]);
        break;

      case 'part':
      case 'leave':
        this.partChannel();
        break;

      case 'me':
      case 'emote':
        this.emote(chunks);
        break;

      default:
        console.log("unknown command: " + command);
    }
  }

  emote(chunks){
    const msg = chunks.join(' ');
    this.sendMsg(msg, true);
  }

  partChannel(){
    const command = {
      command: 'part',
      channel: this.props.channel,
      server: this.props.server
    };
    this.props.socket.send(JSON.stringify(command));
  }

  joinChannel(chan){
    const command = {
      command: 'join',
      channel: chan,
      server: this.props.server
    };
    this.props.socket.send(JSON.stringify(command));
  }

  handleSend(e){
    e.preventDefault();
    if(this.props.mobile && this.props.closeKB){
      // only unfocus keyboard on mobile and when activated
      document.activeElement.blur();
    }

    if(this.state.input === "") return;

    //return if no channel is active
    if(this.props.selectedRoom === null){
      this.setState({input:""});
      return;
    }

    //intercept commands
    if(this.state.input[0] === '/'){
      this.processCommand(this.state.input.slice(1));
      this.setState({input:""});
      return;
    }

    //anything past here will send a msg to the channel
    this.sendMsg(this.state.input, false);
  }

  sendMsg(msg, emote){
    const packet = {
      command: "speak",
      server: this.props.server,
      channel: this.props.channel,
      emote: emote,
      msg: btoa(msg)
    };

    this.props.socket.send(JSON.stringify(packet));

    this.setState({input:""});
  }

  render(){
    return(
      <div className="chatbox-input">
        <form onSubmit={this.handleSend.bind(this)}>
          <input value={this.state.input}
                placeholder="Message..."
                onChange={this.update("input").bind(this)}/>
        </form>
      </div>
    );
  }
}

import { connect  } from 'react-redux';
import {newChannelMsgLocal} from '../../actions/channel_actions';

const mapStateToProps = (state, ownProps) =>{

  const target = (state.config.selectedRoom===null? "" :
                    state.config.selectedRoom.split(' '));
  return(
    {
      socket: state.config.socket,
      channel:target[1],
      server:target[0],
      servers: state.config.servers,
      selectedRoom: state.config.selectedRoom,
      mobile: state.config.mobile,
      closeKB: state.config.settings.closeKB
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      newMsg: (obj)=>dispatch(newChannelMsgLocal(obj))
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelInput);
