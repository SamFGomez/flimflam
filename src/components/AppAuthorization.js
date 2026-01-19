import { Component } from 'react';


class AppAuthorization extends Component {

  constructor(props){
    super(props);
    this.state = {};
    
  }

  componentDidMount(){
    window.addEventListener('storage', (event) => {
      window.location.reload();
    });

    var urlParams = new URLSearchParams(window.location.search);
    var authorizationCode = urlParams.get('code');
    var waitingToAuthorize = localStorage.getItem('WaitingToAuthorize')

    if(!!authorizationCode){
        if(waitingToAuthorize === "strava") localStorage.setItem('StravaAuthorizationCode',authorizationCode);
        if(waitingToAuthorize === "spotify") localStorage.setItem('SpotifyAuthorizationCode',authorizationCode);
        localStorage.removeItem('WaitingToAuthorize');
        window.close();
    } 

    var stravaCode = localStorage.getItem('StravaAuthorizationCode');
    var spotifyCode = localStorage.getItem('SpotifyAuthorizationCode');

    this.setState({
      spotifyCode: spotifyCode,
      stravaCode: stravaCode
    })

  } 

  authenticateStrava(){
    var stravaAuthURL = process.env.REACT_APP_STRAVA_AUTH_URL + new URLSearchParams({
      client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
      response_type: process.env.REACT_APP_STRAVA_RESPONSE_TYPE,
      redirect_uri: process.env.REACT_APP_STRAVA_REDIRECT_URI, //redirect to original domain
      approval_prompt: 'force',
      scope: process.env.REACT_APP_STRAVA_SCOPE
    }).toString();

    localStorage.setItem('WaitingToAuthorize','strava');
    window.open(stravaAuthURL, "_blank");
  }

  async authenticateSpotify(){
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    var spotifyAuthURL = process.env.REACT_APP_SPOTIFY_AUTH_URL + new URLSearchParams({
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      response_type: process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE,
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI, //redirect to original domain
      scope: process.env.REACT_APP_SPOTIFY_SCOPE,
      code_challenge_method: 'S256',
      code_challenge: challenge
    }).toString();
  
    localStorage.setItem('WaitingToAuthorize','spotify');
    window.open(spotifyAuthURL, "_blank");
  }

  async getSpotifyAccessInformation(authorizationCode){
    var url = process.env.REACT_APP_FLIMFLAM_API_URL + '/Music/StartSession?' + new URLSearchParams({
      user_code: authorizationCode,
      verifier: localStorage.getItem('verifier')
    }).toString();

    var spotifyAuthDetails = null;
    var authDetails = sessionStorage.getItem('spotifyAuthDetails');
    if(!!authDetails){
      spotifyAuthDetails = JSON.parse(authDetails);
    }
    if(!spotifyAuthDetails?.access_token){
      await fetch(url).then(response => response.json()).then(data =>{
      
        var spotifyAuthDetails = {
          access_token: data?.accessToken,
          refresh_token: data?.refreshToken,
          expires_at: data?.expiresAt,
        };
        
        if(!!spotifyAuthDetails.access_token){
          sessionStorage.setItem('spotifyAuthDetails', JSON.stringify(spotifyAuthDetails));
          return true;
        }
      });
    } else {
      return true;

    }
  }

  async getStravaAccessInformation(authorizationCode){
    var url = process.env.REACT_APP_FLIMFLAM_API_URL + '/Activity/StartSession?' + new URLSearchParams({
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
          return true;
        }
      });
    } else {
      return true;

    }
  }

  async getAuthorizationCodes(){
    var stravaCode = localStorage.getItem('StravaAuthorizationCode');
    var spotifyCode = localStorage.getItem('SpotifyAuthorizationCode');

    var strava_result = await this.getStravaAccessInformation(stravaCode);
    var spotify_result = await this.getSpotifyAccessInformation(spotifyCode);

    if(spotify_result && strava_result){
      this.props.authorizationCallback();
    }
  }

  generateCodeVerifier(length) {
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  async generateCodeChallenge(codeVerifier) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
  }
  
  render() {
    var {stravaCode, spotifyCode} = this.state;

    return (
      <div className = "defaultContainer">
        <h1 className="ComponentTitle"> Welcome! </h1>
        <div className="AppAuthorizationButtonsContainer">
          {!stravaCode ?
            <button onClick={() => this.authenticateStrava()}> Strava Authorization </button> 
          : <button>Strava GOOD</button> }
          {!spotifyCode ?
            <button onClick={() => this.authenticateSpotify()}> Spotify Authorization </button>
          : <button>Spotify GOOD</button>}

          {spotifyCode && stravaCode ? 
            <button onClick={()=>this.getAuthorizationCodes()}> Click Me </button>
          : null}

        </div>
      </div>
    );
  }
}

export default AppAuthorization;