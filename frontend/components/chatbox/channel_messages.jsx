import React from 'react';
import Linkify from 'linkifyjs/react';
import leftPad from 'left-pad';
import {parse} from 'date-fns';

class ChannelMessages extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidUpdate(){
    const cbox = document.getElementById("chatbox");
    cbox.scrollTop = cbox.scrollHeight - cbox.clientHeight;
  }

  render(){
    let msgs = [];
    if(this.props.selectedRoom !== null){

      msgs = this.props.messages[this.props.selectedRoom].map((line,idx)=>{
        const d = parse(line.timestamp);
        const hours = leftPad(d.getHours(), 2, '0');
        const minutes = leftPad(d.getMinutes(), 2, '0');
        const time =  hours + ":" + minutes;
        let timestamp = null;

        if(this.props.timestamps){
          timestamp = (
            <div className="chatmsg-time-container">
              <span className="chatmsg-time">{time} </span>
            </div>
          );
        }

        var finalLine = null;

        const emoteClass = line.emote ? " chatbox-emote" : "";
        const pre = line.emote ? '● ' : '';
        const post = line.emote ? '' : ': ';
        const ourNick = this.props.servers[this.props.server].nickname;
        const selfMsg = ourNick === line.user;

        if(line.system === true){
          finalLine = (
            <div className="chatbox-msg-line chatbox-system"
                 key={`chatmsg${idx}`}>-- {`${line.msg}`} --</div>
          );
        }else{
          const fmtLine = (<Linkify tagName="p">{atob(line.msg)}</Linkify>);

          finalLine = (
            <div className={"chatbox-msg-line" + emoteClass}>
              {pre}
              <span className={"chatmsg-name" + (selfMsg ? " chat-self" : "")}>
                {line.user}{post}
              </span>
              {fmtLine}
            </div>
          );
        }


        return(
          <div className="chatbox-msg-group" key={`chatmsg${idx}`}>
            {timestamp}
            {finalLine}
          </div>
        );
      });
    }

    msgs = msgs.reverse();

    return(
      <div id="chatbox" className="chatbox-messages">
        {msgs}
        <div id="chatbox-msg-end"></div>
      </div>
    );
  }
}


import { connect  } from 'react-redux';

const mapStateToProps = (state, ownProps) =>{
  // debugger
  return(
    {
      messages: state.messages.messages,
      selectedRoom: state.config.selectedRoom,
      timestamps: state.config.settings.timestamps,
      servers: state.config.servers,
      server: state.config.server
    }
  );
};

export default connect(
  mapStateToProps
)(ChannelMessages);
