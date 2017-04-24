import React from 'react';

class ServerList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selected_server: "",
      selected_chan: "",
      hidden_servers: {}
    }
  }

  componentWillReceiveProps(newProps){
    const newRoom = newProps.config.selectedRoom;
    if(newRoom === null) return;

    const chunks = newRoom.split(' ');
    if(this.state.selected_server !== chunks[0] || this.state.selected_chan !== chunks[1]){
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
      this.props.roomCallback(`${server} ${chan}`);
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


  render(){
    const that = this;
    const content = Object.keys(this.props.config.servers).map((server_key)=>{
      const server = that.props.config.servers[server_key];
      // debugger
      const channels = Object.keys(server.channels).map((chan)=>{
        const selected = (that.state.selected_chan === chan &&
                          that.state.selected_server === server_key)
        return(
          <div key={`${server_key}${chan}`}
               className={"serverlist-entry" + (selected ? " sl-entry-selected" : "")}
               onClick={that.changeSelected(server_key,chan).bind(that)}>{chan}</div>
        );
      });

      const hidden = (!!that.state.hidden_servers[server_key])
      return(
        <div  key={server_key} className="sl-servergroup">
          <div className="sl-server-entry" onClick={that.toggleHidden(server_key).bind(that)}>{server_key}</div>
          <div className={"sl-server-dropdown" + (hidden ? " sl-dropdown-hidden" : "")}>{channels}</div>
        </div>
      );
    });

    return(
      <div className="chatbox-serverlist">
        {content}
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
