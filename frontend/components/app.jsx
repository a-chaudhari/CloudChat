import React from 'react';
import Session from './session';
import ChatBoxContainer from './chatbox/chatbox_container';

class App extends React.Component{
  constructor(props){
    super(props);
  }

  updateWindowSize(){
    if(window.innerWidth > 768){
      this.props.changeUI(false);
    }else{
      this.props.changeUI(true);
    }
  }

  componentDidMount(){
    this.updateWindowSize();
    window.addEventListener('resize', this.updateWindowSize.bind(this));
  }

  ws_connect(key){
    this.ws = new WebSocket(`ws://${window.location.hostname}:8080/${key}`);
    this.ws.onmessage = this.ws_recv.bind(this);
    this.props.receiveSocket(this.ws);
  }

  ws_send(msg){
    this.ws.send(msg);
  }

  ws_recv(input){
    const obj = JSON.parse(input.data);
    if(obj["command"]===undefined) return;

    switch(obj["command"]){
      case "welcome_package":
        this.props.receiveWelcomePackage(obj);
        break;

      case "chanmsg":
        this.props.newChannelMsg(obj, this.props.selectedRoom);
        break;

      case "chan_join":
        this.props.newChannelMsg({
          server: obj['server'],
          channel: obj['channel'],
          system: true,
          msg: `${obj['user']} joined the channel`,
          timestamp: obj['timestamp']
        });
        this.props.userJoin(obj);
        break;

      case "chan_part":
        var msg = "";
        if(obj['quit_msg'] === ""){
          msg = `${obj['user']} left the channel`;
        }
        else{
          msg = `${obj['user']} has disconnected. (${atob(obj['quit_msg'])})`;
        }
        this.props.newChannelMsg({
          server: obj['server'],
          channel: obj['channel'],
          timestamp: obj['timestamp'],
          system: true,
          msg: msg
        });
        this.props.userPart(obj);
        break;

      case 'chan_self_part':
        this.props.userSelfPart({
          server: obj['server'],
          channel: obj['channel']
        });
        break;

      case 'add_server':
        this.props.addServer(obj);
        break;

      case 'del_server':
        this.props.delServer(obj);
        break;

      case 'chan_self_join':
        this.props.userSelfJoin(obj);
        break;

      case 'new_topic':
        this.props.newTopic({
          server: obj['server'],
          channel: obj['channel'],
          topic: obj['topic']
        });
        break;

      default:
        console.error(`undefined command received: ${obj["command"]}`);
        return;
    }
  }

  ws_disconnect(){
    this.ws.close();
  }

  render(){
    const logged_in = this.props.session.session === null ? false : true;
    var container = null;
    if(logged_in){
      container = <ChatBoxContainer
                    token={this.props.session.session.token}
                    connect={this.ws_connect.bind(this)}/>;
    }
    else {
      container = <Session/>;
    }
    return container;
  }
}



import { connect  } from 'react-redux';
import {newChannelMsg, userJoin, userPart, userSelfJoin, userSelfPart} from '../actions/channel_actions';
import {receiveWelcomePackage, receiveSocket, changeUI, newTopic, addServer, delServer} from '../actions/configuration_actions';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      session: state.session,
      selectedRoom: state.config.selectedRoom
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      changeUI: (mobile)=>dispatch(changeUI(mobile)),
      userJoin: (obj)=>dispatch(userJoin(obj)),
      userPart: (obj)=>dispatch(userPart(obj)),
      userSelfJoin: (obj)=>dispatch(userSelfJoin(obj)),
      userSelfPart: (obj)=>dispatch(userSelfPart(obj)),
      receiveWelcomePackage: (obj)=>dispatch(receiveWelcomePackage(obj)),
      newChannelMsg: (obj, room)=>dispatch(newChannelMsg(obj, room)),
      receiveSocket: (obj)=>dispatch(receiveSocket(obj)),
      newTopic: (obj)=>dispatch(newTopic(obj)),
      addServer: (obj)=>dispatch(addServer(obj)),
      delServer: (obj)=> dispatch(delServer(obj))
    }
  );
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
