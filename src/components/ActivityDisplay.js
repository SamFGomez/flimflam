import { Component } from 'react';
import ActivityDetail from './ActivityDetail.js';

class ActivityDisplay extends Component {
  
  constructor(props){
      super(props);
      this.state = {
          activities: []
      }
  }

  componentDidMount(){
    var authDetails = JSON.parse(sessionStorage.getItem('stravaAuthDetails'));
    if(authDetails?.access_token){
      this.getAllActivities();
    }
  }
  convertSecondsToHHMMSS(seconds) {
    if (!seconds || seconds < 0) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  convertPaceToMinPerMile(speedMps) {
    if (!speedMps || speedMps <= 0) return 'N/A';
    
    // Convert meters/second to miles/hour
    const speedMph = speedMps * 2.23694;  // 1 m/s ≈ 2.23694 mph
    
    // Calculate minutes per mile
    const paceMinPerMile = 60 / speedMph;
    
    // Format as mm:ss
    const minutes = Math.floor(paceMinPerMile);
    const seconds = Math.round((paceMinPerMile - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  getAllActivities(){
    var authDetails = JSON.parse(sessionStorage.getItem('stravaAuthDetails'));
    var spotifyAuthDetails = JSON.parse(sessionStorage.getItem('spotifyAuthDetails'));
    var url = process.env.REACT_APP_FLIMFLAM_API_URL + '/Activity/GetActivityList?' + new URLSearchParams({
      access_token: authDetails?.access_token,
      spotifyAccessToken: spotifyAuthDetails?.access_token
    }).toString();
    
    fetch(url).then(response => response.json()).then(data =>{

      var latestDate = new Date(data.recentSongs?.length > 0 ? new Date(Math.min(...data.recentSongs.map(song => new Date(song.played_at)))) : null);

      var activities = data?.activityList?./*filter(x=>new Date(x.start_date_local.replace('Z', '')) > latestDate).*/map(x=>{return{
            id: x.id, 
            title: x.name, 
            date: x.start_date_local,
            hr: x.average_heartrate ? x.average_heartrate.toFixed(0) : 'N/A', 
            pace: this.convertPaceToMinPerMile(x.average_speed), 
            milage: (x.distance / 1609.34).toFixed(1), // meters to miles
            duration: this.convertSecondsToHHMMSS(x.elapsed_time)
      }});
      
      //Temporary just to get song data going
      sessionStorage.setItem('activitySongData', JSON.stringify(data?.recentSongs || {}));

      this.setState({activities: activities});
    })
  }
  selectActivity(id){
    var targetActivity = this.state.activities.find(x=>x.id===id);
    this.setState({selectedActivityDetail: targetActivity})
  }
  ActivityChoice = (props) => {
    return (
      <button id={props.id} className="ActivityChoiceButton" onClick={(e)=>this.selectActivity(props.id)}>
        <div className="ActivityChoice" >
          <img src="/images/running-man.png" alt="Running Icon" />
          <p className="ActivityChoiceTitle">
            <span>{props.title}</span>
          </p>
          <div className="ActivityChoiceDescription">
            <div className="ActivityChoiceTextContainer">
              <p>{new Date(props.date.replace("Z", "")).toLocaleDateString()}</p>
              <p>{props.duration}</p>
              <p>HR: {props.hr}</p>
            </div>
            <div className="ActivityChoiceTextContainer">
              <p>{props.milage} mi</p>
              <p>{props.pace}/mi</p>
            </div>
          
          </div>
        </div>
      </button>
    );
  }

  render() {
    var {activities,selectedActivityDetail} = this.state;

    return (
      <div className="defaultContainer">
        {selectedActivityDetail ? 
          <button className="ActivityDetailBackButton" onClick={()=>this.setState({selectedActivityDetail:null})}>
            <img className="ActivityDetailBackButtonImage" src="/images/backArrow.png" alt="Back Arrow" />
          </button>
        : null}
          <h1 className="ComponentTitle"> {selectedActivityDetail ? selectedActivityDetail.title : "Recent Activities"} </h1>
        <div className="ActivityChoicesCointainer">
          {selectedActivityDetail ? 
            <ActivityDetail 
              activity={selectedActivityDetail} /> 
            : 
            activities.map((x,i)=>{
              return (
                <this.ActivityChoice
                  key={"Activity_"+i}
                  id={x.id}
                  title={x.title} 
                  date={x.date} 
                  hr={x.hr} 
                  pace={x.pace} 
                  milage={x.milage} 
                  duration={x.duration}/>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default ActivityDisplay;