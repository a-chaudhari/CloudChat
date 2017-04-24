import React from 'react';

class ChannelInput extends React.Component{
  constructor(props){
    super(props);
    this.state={
      input:""
    }
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

      default:
        console.log("unknown command: " + command)
    }
  }

  joinChannel(chan){
    console.log("joining: " + chan)
    const command = {
      command: 'join',
      channel: chan,
      server: this.props.server
    };
    this.props.socket.send(JSON.stringify(command));
  }

  handleSend(e){
    e.preventDefault();

    //intercept commands
    if(this.state.input[0] === '/'){
      this.processCommand(this.state.input.slice(1))
      this.setState({input:""});
      return;
    }

    const packet = {
      command: "speak",
      server: this.props.server,
      channel: this.props.channel,
      msg: btoa(this.state.input)
    }

    this.props.socket.send(JSON.stringify(packet));

    this.props.newMsg({
      user: this.props.servers[this.props.server].nickname,
      msg: btoa(this.state.input),
      target: this.props.selectedRoom
    });
    this.setState({input:""});
  }

  render(){
    return(
      <div className="chatbox-input">
        <form onSubmit={this.handleSend.bind(this)}>
          <input value={this.state.input} onChange={this.update("input").bind(this)}/>
          <button onClick={this.handleSend.bind(this)}>Send</button>
        </form>
      </div>
    );
  }
}



import { connect  } from 'react-redux';
import {newChannelMsgLocal} from '../../actions/channel_actions';

const mapStateToProps = (state, ownProps) =>{

  const target = (state.config.selectedRoom===null? "" :  state.config.selectedRoom.split(' '));
  // debugger
  return(
    {
      socket: state.config.socket,
      channel:target[1],
      server:target[0],
      servers: state.config.servers,
      selectedRoom: state.config.selectedRoom
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
