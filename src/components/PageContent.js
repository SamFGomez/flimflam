import { Component } from 'react';
import ActivityDisplay from './ActivityDisplay.js'; 
import AppAuthorization from './AppAuthorization.js';

//Main Content on Page
class PageContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      stravaAuthorized:false,
      spotifyAuthorized:false
    }
  }

  authorizationCallback(){
    var stravaValidated = !!JSON.parse(sessionStorage.getItem('stravaAuthDetails')).access_token
    var spotifyValidated = !!JSON.parse(sessionStorage.getItem('spotifyAuthDetails')).access_token; //Replace with strava get code
    this.setState({
      bigAuthorized: stravaValidated && spotifyValidated
    });
  }

  render() {
    var {bigAuthorized } = this.state;

    return (
      <div className="PageContent">
        <div className="PageContentColumn">
          {!bigAuthorized ? <AppAuthorization
            authorizationCallback={()=>this.authorizationCallback()}
          /> : null }
          {bigAuthorized ? <ActivityDisplay /> : null}
        </div>
      </div>
    );
  }
}

export default PageContent;