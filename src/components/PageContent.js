import { Component } from 'react';
import '../css/style.css';
import ToDo from './ToDo.js'; 
import WeatherCentral from './WeatherCentral.js'; 
import RunCentral from './RunCentral.js'; 

//Main Content on Page
class PageContent extends Component {
  render() {
    return (
      <div class="PageContent">
        <div class="PageContentColumn">
          <ToDo />
        </div>
        <div class="PageContentColumn">
          <WeatherCentral />
          <RunCentral />
        </div>
        
      </div>
    );
  }
}

export default PageContent;