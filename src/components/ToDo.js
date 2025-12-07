import { Component } from 'react';


class ToDo extends Component {

  constructor(props){
      super(props);
      this.state = {
          messages: []
      }
  }

  addNewToDOItem(message){
    var {messages} = this.state;
    messages.push(message);
    this.setState({messages: messages});
  }

  componentDidMount(){
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') this.addNewToDOItem(e.target.value);
    });
  }

  render() {
    var {messages} = this.state;

    return (
      <div class="defaultContainer">
        <h1> ToDo List</h1>
        <div> 
          {messages.map((x,i)=>{
            return (
              <div class="bulletContainer">
                <p>{`${messages.indexOf(x)+1}. ${x}`}</p>
              </div>
            );
          })}
          <input id="newToDoInput" type="text" placeholder="New ToDo Item" />
          <button style={{display:"none"}} type="submit" onClick={()=>this.addNewToDOItem(document.getElementById("newToDoInput").value)}> 
            Add ToDo Item 
          </button>
        </div>
      </div>
    );
  }
}

export default ToDo;