import { Component } from 'react';

import ToDo from './ToDo.js'; 
import WeatherCentral from './WeatherCentral.js'; 
import RunCentral from './RunCentral.js'; 

//Main Content on Page
class PageContent extends Component {
  render() {
    return (
      <div className="PageContent">
        <div className="PageContentColumn">
          <ToDo />
        </div>
        <div className="PageContentColumn">
          <WeatherCentral />
          <RunCentral />
        </div>
        
      </div>
    );
  }
}

export default PageContent;