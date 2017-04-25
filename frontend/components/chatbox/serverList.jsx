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
    }
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
      console.log(`${server} ${chan}`)
      this.props.changeRoom(`${server} ${chan}`);
    };
  }

  toggleHidden(server){
    return (e)=>{
      const hidden = (!!this.state.hidden_servers[server])
      const state = this.state.hidden_servers
      if(hidden){
        delete state[server];
      }
      else{
        state[server]=true;
      }
      this.setState({hidden_servers: state})
    };
  }

  update(field){
    return (e)=>{
      this.setState({[field]: e.target.value});
    }
  }

  serverPlus(server){
    return (e)=>{
      e.preventDefault();
      e.stopPropagation();
      console.log("adding to: " + server);
      this.setState({joinChanModalOpen: true, joinChanModalServer: server});
    }
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

      this.props.config.socket.send(JSON.stringify(command));
    }
  }

  joinChan(e){
    e.preventDefault();
    // this.closeModal();
    const chan = this.state.joinChanModalChannel;
    this.setState({joinChanModalOpen: false, joinChanModalChannel: ""})

    const command = {
      command: 'join',
      channel: chan,
      server: this.state.joinChanModalServer
    };
    this.props.config.socket.send(JSON.stringify(command));

  }


  render(){
    const that = this;
    const content = Object.keys(this.props.config.servers).map((server_key)=>{
      const server = that.props.config.servers[server_key];
      const channels = Object.keys(server.channels).map((chan)=>{
        const selected = (that.state.selected_chan === chan &&
                          that.state.selected_server === server_key)
        const minusButton = (<div onClick={this.chanMinus(chan).bind(this)} className="chan-minus"><i className="fa fa-times-circle" aria-hidden="true"></i></div>)
        return(
          <div key={`${server_key}${chan}`}
               className={"serverlist-entry" + (selected ? " sl-entry-selected" : "")}
               onClick={that.changeSelected(server_key,chan).bind(that)}>{chan}{minusButton}</div>
        );
      });

      const hidden = (!!that.state.hidden_servers[server_key])
      const plusButton = (<div onClick={this.serverPlus(server_key).bind(this)} className="server-plus"><i className="fa fa-plus-circle" aria-hidden="true"></i></div>);


      return(
        <div  key={server_key} className="sl-servergroup">
          <div className="sl-server-entry" onClick={that.toggleHidden(server_key).bind(that)}>{server_key}{plusButton}</div>
          <div className={"sl-server-dropdown" + (hidden ? " sl-dropdown-hidden" : "")}>{channels}</div>
        </div>
      );
    });

    const modalStyle={
      content: {
        maxWidth: '200px',
        maxHeight: '100px',
        backgroundColor: 'LemonChiffon'
      }
    }

    return(
      <div className="chatbox-serverlist">
        {content}
        <Modal
          isOpen={this.state.joinChanModalOpen}
          contentLabel="join channel modal"
          onRequestClose={this.closeModal.bind(this)}
          style={modalStyle}
          >
            <form onSubmit={this.joinChan.bind(this)}>
              <label>
                Channel Name:
                <input onChange={this.update('joinChanModalChannel').bind(this)} value={this.state.joinChanModalChannel}/>
              </label>
              <button onClick={this.joinChan.bind(this)}>Join</button>
              <button onClick={this.closeModal.bind(this)}>Cancel</button>
            </form>
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
      config: state.config
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
