import React from 'react';

class ChannelMessages extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    // const msgs = new Array(100);
    // msgs.fill('this is a test message');
    // const msg_els = msgs.map((el,idx)=>{
    //
    //   return(
    //     <div key={`chatmsg${idx}`} className="chatbox-msg-line">{el}</div>
    //   );
    // });
    let msg_els = [];
    if(this.props.selectedRoom !== ""){
      // debugger
      msg_els = this.props.messages[this.props.selectedRoom].map((line,idx)=>{
        if(line.system === true){
          return(
            <div className="chatbox-msg-line chatbox-system" key={`chatmsg${idx}`}>{`${line.msg}`}</div>
          )
        }
        return(
          <div className="chatbox-msg-line" key={`chatmsg${idx}`}>{`${line.user}: ${line.msg}`}</div>
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
      selectedRoom: ownProps.selectedRoom
    }
  );
};

export default connect(
  mapStateToProps
)(ChannelMessages);
