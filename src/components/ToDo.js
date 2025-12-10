import { Component } from 'react';


class ToDo extends Component {

  constructor(props){
      super(props);
      this.state = {
          messages: []
      }
  }

  addNewToDOItem(message){
    if(!message || !message.toString().trim()) return;
    this.setState(prev => ({ messages: [...prev.messages, message] }));
    const input = document.getElementById("newToDoInput");
    if(input) input.value = "";
  }

  getTasks(){
    fetch('https://localhost:7167/Task').then(response => response.json()).then(data =>{
      this.setState({messages: data.map(x=>x.summary)});
    })
  }

  componentDidMount(){
    this.getTasks();
  }

  render() {
    var {messages} = this.state;

    return (
      <div className="defaultContainer">
        <h1> ToDo List</h1>
        <div> 
          {messages.map((x,i)=>{
            return (
              <div key={`bullet-${i}`} id={`bullet-${i}`} className="bulletContainer">
                <p>{`${i+1}. ${x}`}</p>
              </div>
            );
          })}
          <input id="newToDoInput" type="text" placeholder="New ToDo Item" onKeyDown={(e)=>{ if(e.key === 'Enter') this.addNewToDOItem(e.target.value); }} />
        </div>
      </div>
    );
  }
}

export default ToDo;