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
      port: 6667
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
    this.setState({modalOpen: false});
  }

  update(field){
    return (e)=>(this.setState({[field]: e.target.value}));
  }

  inputGen(prettyName, field){
    return(
      <label className="server-modal-label">
        {prettyName}
        <input value={this.state[field]}
                onChange={this.update(field).bind(this)}
                className="server-modal-input"/>
      </label>
    );
  }

  newServer(e){
    //TODO validation
    e.preventDefault();
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
        <span>Add Server</span>
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="connect server modal"
          onRequestClose={this.closeModal.bind(this)}
          className="add-server-modal"
          >
          <form onSubmit={this.newServer.bind(this)}>
            {this.inputGen('Server URL: ', 'server')}
            {this.inputGen('Nickname: ', 'nickname')}
            {this.inputGen('User Name: ', 'username')}
            {this.inputGen('Real Name: ', 'realname')}
            {this.inputGen('Server Password:', 'serverpass')}
            {this.inputGen('Port # ', 'port')}
            <button onClick={this.newServer.bind(this)}>Submit</button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default AddServer;
