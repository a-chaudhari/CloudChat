import { connect  } from 'react-redux';
import ChatBox from './chatbox';

const mapStateToProps = (state, ownProps) =>{
  return(
    {

    }
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>{
  return(
    {
      connect_websocket: (key)=>ownProps.connect(key)
    }
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
