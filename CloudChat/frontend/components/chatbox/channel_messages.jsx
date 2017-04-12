import React from 'react';

class ChannelMessages extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const msgs = new Array(100);
    msgs.fill('this is a test message');
    const msg_els = msgs.map((el,idx)=>{

      return(
        <div key={`chatmsg${idx}`} className="chatbox-msg-line">{el}</div>
      );
    });

    return(
      <div className="chatbox-messages">
        {msg_els}
      </div>
    );
  }
}

export default ChannelMessages;
