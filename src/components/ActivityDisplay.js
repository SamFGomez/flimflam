import { Component } from 'react';

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

  getAllActivities(){
    var authDetails = JSON.parse(sessionStorage.getItem('stravaAuthDetails'));
    var url = 'http://localhost:5110/Activity/GetActivityList?' + new URLSearchParams({
      access_token: authDetails?.access_token
    }).toString();
    
    fetch(url).then(response => response.json()).then(data =>{
      var activities = data?.activityList?.map(x=>{return{
            id: x.id, 
            title: x.name, 
            date: x.start_date_local, 
            hr: x.average_heart_rate, 
            pace: x.average_speed, 
            milage: x.distance, 
            duration: x.elapsed_time
      }});
      this.setState({activities: activities});
    })
  }

  selectActivity(e){
    console.log(e.target.id);
  }

  ActivityChoice = (props) => {
    return (
      <button id={props.id} className="ActivityChoiceButton" onClick={(e)=>this.selectActivity(e)}>
        <div className="ActivityChoice" >
          <img src="/images/running-man.png" alt="Running Icon" />
          <p className="ActivityChoiceTitle">
            <span>{props.title}</span>
          </p>
          <div className="ActivityChoiceDescription">
            <div className="ActivityChoiceTextContainer">
              <p>{props.date}</p>
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
    var {activities} = this.state;

    return (
      <div className="defaultContainer">
        <h1 className="ComponentTitle"> Activities </h1>
        <div className="ActivityChoicesCointainer">
          {activities.map((x,i)=>{
            return (
              <this.ActivityChoice
                id={x.id}
                title={x.title} 
                date={x.date} 
                hr={x.hr} 
                pace={x.pace} 
                milage={x.milage} 
                duration={x.duration}/>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ActivityDisplay;