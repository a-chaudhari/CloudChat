import React from 'react';
import Modal from 'react-modal';

class ServerList extends React.Component{
  constructor(props){
    super(props);
    Modal.setAppElement('#root');
    this.state={
      selected_server: "",
      selected_chan: "",
      hidden_servers: {},
      joinChanModalOpen: false,
      joinChanModalServer: "",
      joinChanModalChannel: ""
    };
  }

  componentWillReceiveProps(newProps){
    const newRoom = newProps.config.selectedRoom;
    if(newRoom === null) return;

    const chunks = newRoom.split(' ');
    if(this.state.selected_server !== chunks[0] || this.state.selected_chan !== chunks[1]){

      //uncolapse the server if collapsed
      let newHidden = this.state.hidden_servers;
      delete newHidden[chunks[0]];

      this.setState({selected_chan: chunks[1],
        selected_server: chunks[0],
        hidden_servers: newHidden});
    }
  }

  changeSelected(server,chan){
    return (e)=>{
      this.setState({selected_server:server, selected_chan: chan});
      // this.props.roomCallback(`${server} ${chan}`);
      console.log(`${server} ${chan}`);
      this.props.changeRoom(`${server} ${chan}`);
    };
  }

  toggleHidden(server){
    return (e)=>{
      const hidden = (!!this.state.hidden_servers[server]);
      const state = this.state.hidden_servers;
      if(hidden){
        delete state[server];
      }
      else{
        state[server]=true;
      }
      this.setState({hidden_servers: state});
    };
  }

  update(field){
    return (e)=>{
      this.setState({[field]: e.target.value});
    };
  }

  serverPlus(server){
    return (e)=>{
      e.preventDefault();
      e.stopPropagation();
      console.log("adding to: " + server);
      this.setState({joinChanModalOpen: true, joinChanModalServer: server});
    };
  }

  delServer(){
    const command = {
      command: 'disconnect',
      server: this.state.selected_server
    };
    this.props.socket.send(JSON.stringify(command));
    this.setState({joinChanModalOpen: false});
  }

  closeModal(e){
    e.preventDefault();
    this.setState({joinChanModalOpen: false});
  }

  chanMinus(chan){
    return(e)=>{
      e.preventDefault();
      e.stopPropagation();

      const chunks = this.props.config.selectedRoom.split(' ');
      const command = {
        command: "part",
        server: chunks[0],
        channel: chan
      };

      this.props.socket.send(JSON.stringify(command));
    };
  }

  joinChan(e){
    e.preventDefault();
    // this.closeModal();
    const chan = this.state.joinChanModalChannel;
    this.setState({joinChanModalOpen: false, joinChanModalChannel: ""});

    const command = {
      command: 'join',
      channel: chan,
      server: this.state.joinChanModalServer
    };
    this.props.socket.send(JSON.stringify(command));

  }

  renderCloseChannelButton(chan){
    return(
      <div onClick={this.chanMinus(chan).bind(this)}
           className="chan-minus">
        <i className="fa fa-times-circle" aria-hidden="true"></i>
      </div>
    );
  }

  renderServerDotButton(serverKey){
    return (
      <div onClick={this.serverPlus(serverKey).bind(this)}
           className="server-plus">
        <i className="fa fa-plus-circle" aria-hidden="true"></i>
      </div>
    );
  }

  renderServerArrowIcon(hidden){
    const className = (hidden ? " fa-caret-right" : " fa-caret-down");
    return (
      <i className={"fa server-arrow" + className } aria-hidden="true"></i>
    );
  }

  renderChannelList(server){
    const that = this;
    return Object.keys(server.channels).map((chan)=>{
      const serverKey = server.server;

      //whether or not the channel should be highlighted
      const selected = (that.state.selected_chan === chan &&
                        that.state.selected_server === serverKey);

      //the close-channel button
      const minusButton = this.renderCloseChannelButton(chan);

      const className = (selected ? " sl-entry-selected" : "");

      return(
        <div key={`${serverKey}${chan}`}
             className={"serverlist-entry" + className}
             onClick={that.changeSelected(serverKey,chan).bind(that)}>
          {chan}{minusButton}
        </div>
      );
    });
  }

  renderServerList(){
    const that = this;
    return Object.keys(this.props.config.servers).map((serverKey)=>{
      const server = that.props.config.servers[serverKey];

      //builds the list of channels for each server
      const channels = this.renderChannelList(server);

      //is this server entry folded closed?
      const hidden = (Boolean(that.state.hidden_servers[serverKey]));

      //the '...' button for each server entry
      const dotButton = this.renderServerDotButton(serverKey);

      //the arrow icon for each entry
      const serverArrow = this.renderServerArrowIcon(hidden);

      return(
        <div  key={serverKey} className="sl-servergroup">
          <div className="sl-server-entry"
              onClick={that.toggleHidden(serverKey).bind(that)}>
                {serverArrow}{serverKey}{dotButton}
            </div>
          <div className={"sl-server-dropdown" + (hidden ? " hidden" : "")}>
            {channels}
          </div>
        </div>
      );
    });
  }


  render(){

    //builds the list of servers and respective channels
    const content = this.renderServerList();

    const modalStyle={
      content: {
        maxWidth: '200px',
        maxHeight: '100px',
        backgroundColor: 'LemonChiffon'
      }
    };

    return(
      <div className="chatbox-serverlist">
        {content}
        <Modal
          isOpen={this.state.joinChanModalOpen}
          contentLabel="join channel modal"
          onRequestClose={this.closeModal.bind(this)}
          style={modalStyle}
          >
          <div>
            <form onSubmit={this.joinChan.bind(this)}>
              <label>
                Channel Name:
                <input onChange={this.update('joinChanModalChannel').bind(this)}
                        value={this.state.joinChanModalChannel}/>
              </label>
              <button onClick={this.joinChan.bind(this)}>Join</button>
              <button onClick={this.closeModal.bind(this)}>Cancel</button>
              <br/>
            </form>
            <button className="del-server-button"
              onClick={this.delServer.bind(this)}>DELETE SERVER</button>
            </div>
          </Modal>
      </div>
    );
  }
}



import { connect  } from 'react-redux';
import {changeRoom} from '../../actions/configuration_actions';


const mapStateToProps = (state, ownProps) =>{
  return(
    {
      config: state.config,
      socket: state.config.socket
    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      changeRoom: (room) => dispatch(changeRoom(room))
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerList);
