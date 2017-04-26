import React from 'react';
import Linkify from 'linkifyjs/react';

class ChannelMessages extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let msg_els = [];
    if(this.props.selectedRoom !== null){


      msg_els = this.props.messages[this.props.selectedRoom].map((line,idx)=>{
        if(line.system === true){
          return(
            <div className="chatbox-msg-line chatbox-system" key={`chatmsg${idx}`}>{`${line.msg}`}</div>
          )
        }
        const formatted_line = (<Linkify tagName="p">{atob(line.msg)}</Linkify>)
        return(
          <div className="chatbox-msg-line" key={`chatmsg${idx}`}>
            <span className="chatmsg-name">{line.user}:</span> {formatted_line}
          </div>
        );
      });
    }


    return(
      <div className="chatbox-messages">
        {msg_els}
      </div>
    );
  }
}


import { connect  } from 'react-redux';

const mapStateToProps = (state, ownProps) =>{
  return(
    {
      messages: state.messages.messages,
      selectedRoom: state.config.selectedRoom
    }
  );
};

export default connect(
  mapStateToProps
)(ChannelMessages);
