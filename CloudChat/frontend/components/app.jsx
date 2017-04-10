import React from 'react';
import Channel from './chatbox/channel';
import {newChannelMsg} from '../actions/channel_actions';

class App extends React.Component{
  constructor(props){
    super(props);
    // debugger
  }

  componentDidMount(){
    this.ws_connect();
  }


  ws_connect(){
    this.ws = new WebSocket('ws://127.0.0.1:8080/abcd1234');
    this.ws.onmessage = this.ws_recv.bind(this);
  }

  ws_send(msg){
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
    return(
      <div className="wholeApp">
        <Channel/>
      </div>
    );
  }
}



import { connect  } from 'react-redux';


// const mapStateToProps = (state, ownProps) =>{
//   return(
//     {
//
//     }
//   );
// };
//
// const mapDispatchToProps = (dispatch, ownProps) =>{
//   return(
//     {
//
//     }
//   );
// };


export default connect()(App);
