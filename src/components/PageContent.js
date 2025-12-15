import { Component } from 'react';
import ActivityDisplay from './ActivityDisplay.js'; 

//Main Content on Page
class PageContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      stravaAuthorized:false,
      spotifyAuthorized:false
    }
  }

  componentDidMount(){
    var urlParams = new URLSearchParams(window.location.search);
    var stravaAuthorizationCode = urlParams.get('code');

    if(!!stravaAuthorizationCode){
      this.getStravaAccessInformation(stravaAuthorizationCode);
    } 
  }

  async getStravaAccessInformation(authorizationCode){
    var url = 'http://localhost:5110/Activity/StartSession?' + new URLSearchParams({
      user_code: authorizationCode
    }).toString();
  
    var stravaAuthDetails = null;
    var authDetails = sessionStorage.getItem('stravaAuthDetails');
    if(!!authDetails){
      stravaAuthDetails = JSON.parse(authDetails);
    }
    if(!stravaAuthDetails?.access_token){
      await fetch(url).then(response => response.json()).then(data =>{
      
        var stravaAuthDetails = {
          access_token: data?.accessToken,
          refresh_token: data?.refreshToken,
          expires_at: data?.expiresAt,
          user: data?.userName
        };
        
        if(!!stravaAuthDetails.access_token){
          sessionStorage.setItem('stravaAuthDetails', JSON.stringify(stravaAuthDetails));
          this.setState({
            stravaAuthorized:true,
          });
        }
      });
    } else {
      this.setState({
        stravaAuthorized:true,
      });
    }
  }
  

  render() {
    var {stravaAuthorized, spotifyAuthorized} = this.state;

    return (
      <div className="PageContent">
        <div className="PageContentColumn">
          {stravaAuthorized ? <ActivityDisplay /> : null}
        </div>
      </div>
    );
  }
}

export default PageContent;