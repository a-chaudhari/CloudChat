import React from 'react';
import Channel from './chatbox/channel';
import {newChannelMsg} from '../actions/channel_actions';
import Session from './session';
import UserBox from './user_box';

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
  }

  ws_send(msg){
    console.log("sending")
    this.ws.send(msg);
  }

  ws_recv(msg){
    console.log(msg);
    this.props.dispatch(newChannelMsg(msg))
  }

  ws_disconnect(){
    this.ws.close();
  }

  render(){
    const logged_in = this.props.session.session === null ? false : true
    var container = null;
    if(logged_in){
      container = <UserBox/>
    }
    else {
      container = <Session/>

    }
    // debugger
    // <Channel send={this.ws_send.bind(this)} join={this.ws_connect.bind(this)}/>
    return(
      <div className="wholeApp">
        <h1>{logged_in? "logged in" : "not logged in" }</h1>
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
