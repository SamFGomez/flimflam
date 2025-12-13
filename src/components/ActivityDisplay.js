import { Component } from 'react';

class ActivityDisplay extends Component {
  
  constructor(props){
      super(props);
      this.state = {
          activities:[
            {id: 1, title: "Morning Run", date: "12/10/25", hr: "145", pace: "8:15", milage: "5.2", duration: "00:42:30"},
            {id: 2, title: "The 2025 New York City Marathon", date: "12/9/25", hr: "138", pace: "9:00", milage: "3.1", duration: "00:27:45"},
            {id: 3, title: "Tempo Run", date: "12/8/25", hr: "150", pace: "7:45", milage: "6.0", duration: "00:46:30"},
            {id: 4, title: "Interval Run", date: "12/7/25", hr: "155", pace: "7:00", milage: "4.5", duration: "00:31:45"},
            {id: 5, title: "Hill Run", date: "12/6/25", hr: "155", pace: "10:30", milage: "4.0", duration: "00:43:00"},
            {id: 6, title: "Long Run", date: "12/5/25", hr: "142", pace: "8:45", milage: "10.0", duration: "01:28:45"},
            {id: 7, title: "Recovery Run", date: "12/4/25", hr: "135", pace: "9:30", milage: "4.0", duration: "00:38:00"},
            {id: 8, title: "Speed Work", date: "12/3/25", hr: "160", pace: "6:45", milage: "5.0", duration: "00:33:45"},
            {id: 9, title: "Trail Run", date: "12/2/25", hr: "148", pace: "9:15", milage: "7.5", duration: "01:09:23"},
            {id: 10, title: "Easy Run", date: "12/1/25", hr: "140", pace: "8:45", milage: "6.2", duration: "00:53:45"},
            {id: 11, title: "Fartlek Run", date: "11/30/25", hr: "152", pace: "8:00", milage: "5.5", duration: "00:44:00"},
            {id: 12, title: "Marathon Pace", date: "11/29/25", hr: "150", pace: "8:30", milage: "8.0", duration: "01:08:00"},
          ]
      }
  }

  selectActivity(e){
    console.log(e.target.id);
  }

  ActivityChoice = (props) => {
    return (
      <button  className="ActivityChoiceButton">
        <div className="ActivityChoice" id={props.id} onClick={this.selectActivity}>
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
                key={`activity-${i}`}
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