import React from 'react';
import Linkify from 'linkifyjs/react';
import leftPad from 'left-pad';

class ChannelMessages extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidUpdate(){
    const objDiv = document.getElementById("chatbox-msg-end");
    objDiv.scrollIntoView();
  }

  render(){
    let msgs = [];
    if(this.props.selectedRoom !== null){

      msgs = this.props.messages[this.props.selectedRoom].map((line,idx)=>{
        const d = new Date(line.timestamp);
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

        if(line.system === true){
          return(
            <div className="chatbox-msg-line chatbox-system"
                 key={`chatmsg${idx}`}>{`${line.msg}`}</div>
          );
        }

        const fmtLine = (<Linkify tagName="p">{atob(line.msg)}</Linkify>);

        return(
          <div className="chatbox-msg-group" key={`chatmsg${idx}`}>
            {timestamp}
            <div className="chatbox-msg-line">
              <span className="chatmsg-name">{line.user}:</span> {fmtLine}
            </div>
          </div>
        );
      });
    }


    return(
      <div className="chatbox-messages">
        {msgs}
        <div id="chatbox-msg-end"></div>
      </div>
    );
  }
}


import { connect  } from 'react-redux';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      messages: state.messages.messages,
      selectedRoom: state.config.selectedRoom,
      timestamps: state.config.settings.timestamps
    }
  );
};

export default connect(
  mapStateToProps
)(ChannelMessages);
