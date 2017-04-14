import React from 'react';
import Channel from './chatbox/channel';
import {newChannelMsg} from '../actions/channel_actions';
import {receiveWelcomePackage, receiveSocket} from '../actions/configuration_actions';
import Session from './session';
// import UserBox from './user_box';
import ChatBoxContainer from './chatbox/chatbox_container';

class App extends React.Component{
  constructor(props){
    super(props);
    // debugger
  }

  componentDidMount(){
    // this.ws_connect();
  }


  ws_connect(key){
    console.log("connecting")
    console.log(key)
    this.ws = new WebSocket(`ws://127.0.0.1:8080/${key}`);
    this.ws.onmessage = this.ws_recv.bind(this);
    this.props.dispatch(receiveSocket(this.ws));
  }

  ws_send(msg){
    console.log("sending")
    this.ws.send(msg);
  }

  ws_recv(msg){
    // console.log(msg);
    // debugger
    const obj = JSON.parse(msg.data)
    console.log(obj)
    if(obj["command"]===undefined) return;

    switch(obj["command"]){
      case "welcome_package":
        this.props.dispatch(receiveWelcomePackage(obj));
        break;
      case "chanmsg":
        this.props.dispatch(newChannelMsg(obj));
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
    const logged_in = this.props.session.session === null ? false : true
    var container = null;
    if(logged_in){
      // container = <UserBox/>
      container = <ChatBoxContainer connect={this.ws_connect.bind(this)}/>
    }
    else {
      // this.ws_connect("abcd1234")
      container = <Session/>

    }
    // debugger
    // <Channel send={this.ws_send.bind(this)} join={this.ws_connect.bind(this)}/>
    // <h1>{logged_in? "logged in" : "not logged in" }</h1>
    return(
      <div className="cloudchat-app">
        {container}
      </div>
    );
  }
}



import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      session: state.session
    }
  );
};
//
// const mapDispatchToProps = (dispatch, ownProps) =>{
//   return(
//     {
//
//     }
//   );
// };


export default connect(mapStateToProps)(App);
