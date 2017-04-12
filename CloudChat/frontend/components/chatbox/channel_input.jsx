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

  handleSend(e){
    e.preventDefault();
    console.log(`sending: ${this.state.input}`);
    this.setState({input:""});
  }

  render(){
    return(
      <div className="chatbox-input">
        <form onSubmit={this.handleSend.bind(this)}>
          <input onChange={this.update("input").bind(this)}/>
          <button onClick={this.handleSend.bind(this)}>Send</button>
        </form>
      </div>
    );
  }
}

export default ChannelInput;
