import React from 'react'

class Channel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      input: "",
      key:"",
    }
  }

  update(field){
    return(e)=>(this.setState({[field]:e.target.value}))
  }

  // send(){
  //   this.props.sendIt(this.state.input)
  // }

  joinserver(e){
    // return (e)=>{
      e.preventDefault();

      console.log("joining")
      console.log(this.state.key)
      this.props.join(this.state.key)
    // }
  }

  sendMsg(e){
    // return (e)=>{
      e.preventDefault();
      console.log("sending msg")
      this.props.sendIt(this.state.input)
    // }
  }

  render(){
    // debugger
    const msgs = this.props.messages.messages.map((line,idx)=>(
      <li key={`msg${idx}`}>{line}</li>
    ))
    return(
      <div className="channel">
        <ul>
          {msgs}
        </ul>
        <input value={this.state.key} onChange={this.update("key").bind(this)}/>
        <button onClick={this.joinserver.bind(this)}>join</button>
        <input value={this.state.input} onChange={this.update("input").bind(this)}/>
        <button onClick={this.sendMsg.bind(this)}>send</button>
      </div>
    );
  }
}

import { connect  } from 'react-redux';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      messages: state.messages
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  // debugger
  return(
    {
      sendIt: (msg) => ownProps.send(msg),
      join: (key) => ownProps.join(key)
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);
