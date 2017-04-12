import React from 'react';

class ServerList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selected:0
    }
  }

  changeSelected(num){
    return (e)=>(this.setState({selected:num}));
  }

  render(){
    const list = ['server1','chan1','chan2','chan3','server2','chan1','chan2'];
    const el_list = list.map((el,idx)=>{

      return(
        <li className={this.state.selected===idx ?
              "serverlist-entry sl-entry-selected"
              : "serverlist-entry"}
            onClick={this.changeSelected(idx).bind(this)}
            key={`serverlist${idx}`}>{el}</li>
      );
    });

    return(
      <div className="chatbox-serverlist">
        <ul>
          {el_list}
        </ul>
      </div>
    );
  }
}

export default ServerList;
