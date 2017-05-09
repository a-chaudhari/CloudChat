import React from 'react';
import Modal from 'react-modal';
import {newServer} from '../../utils/irc_utils';

class AddServer extends React.Component{
  constructor(props){
    super(props);
    this.defaultState={
      modalOpen: false,
      server: "",
      nickname: "",
      username: 'user',
      realname: 'real name',
      serverpass: "",
      port: 6667,
      errors:{}
    };
    this.inputGen = this.inputGen.bind(this);
    this.state = Object.assign({},this.defaultState);
  }

  handleClick(e){
    e.preventDefault();
    console.log("clicked!");
    this.setState({modalOpen: true});
  }

  closeModal(){
    this.setState(this.defaultState);
  }

  update(field){
    return (e)=>(this.setState({[field]: e.target.value}));
  }

  inputGen(prettyName, field, type="text"){
    return(
      <label className="server-modal-label">
        {prettyName}
        <input value={this.state[field]}
                type={type}
                onChange={this.update(field).bind(this)}
                className="server-modal-input"/>
        <div className="add-server-error">{this.state.errors[field]}</div>
      </label>
    );
  }

  validate(){
    let errors = {};
    if(this.state.nickname === ""){
      errors['nickname'] = "Nickname cannot be empty";
    }else if(this.state.nickname.length < 3){
      errors['nickname'] = "Nickname must be at least 3 characters";
    }

    const port = parseInt(this.state.port)

    if(!Number.isInteger(port)
        || port <= 0
        || port > 65535 ){
      errors['port'] = "Port invalid";
    }

    const re = /.*\..*/;  //really simplistic
    if(!re.test(this.state.server)){
      errors['server'] = "Server URL is not a valid URL";
    }

    const passed = Object.keys(errors).length === 0;
    if(!passed){
      this.setState({errors: errors});
    }
    return passed;
  }

  connectPreset(net){
    return (e)=>{
      e.preventDefault();
      // switch(net){
      //   case 'freenode':
      //
      // }
    };
  }

  presetGen(net){
    return(
      <button className="add-server-preset"
              onClick={this.connectPreset(net).bind(this)}>{net}</button>
    );
  }

  newServer(e){
    e.preventDefault();
    if(!this.validate()) return;
    const command = {
      command: 'connect',
      server: this.state.server,
      nickname: this.state.nickname,
      username: this.state.username,
      realname: this.state.realname,
      port: this.state.port,
      serverpass: this.state.serverpass,
      channels: []
    };
    newServer(this.props.socket, command);
    this.setState(this.defaultState);
  }

  render(){
    return(
      <div onClick={this.handleClick.bind(this)}
          className="add-server-button">
          <i className="fa fa-plus-square-o" aria-hidden="true"/>
        <span>Add Server</span>
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="connect server modal"
          onRequestClose={this.closeModal.bind(this)}
          className="add-server-modal"
          >
          <div className="modal-header">
            <h1>New Server</h1>
          </div>
          <form onSubmit={this.newServer.bind(this)}>
            <div className="add-server-divider">Required Settings</div>
            {this.inputGen('Server URL: ', 'server', 'url')}
            {this.inputGen('Nickname: ', 'nickname')}
            <div className="add-server-divider">Optional Settings</div>
            {this.inputGen('User Name: ', 'username')}
            {this.inputGen('Real Name: ', 'realname')}
            {this.inputGen('Server Password:', 'serverpass')}
            {this.inputGen('Port # ', 'port', 'number')}
            <button onClick={this.newServer.bind(this)}>Launch</button>
            <button onClick={this.closeModal.bind(this)}>Cancel</button>
          </form>
        </Modal>
      </div>
    );
  }
}
// <div className="add-server-divider">Preset Servers</div>
// {this.presetGen('freenode')}

export default AddServer;
