import { Component } from 'react';

import ToDo from './ToDo.js'; 
import ActivityDisplay from './ActivityDisplay.js'; 

//Main Content on Page
class PageContent extends Component {
  render() {
    return (
      <div className="PageContent">
        <div className="PageContentColumn">
          <ActivityDisplay/>
        </div>
      </div>
    );
  }
}

export default PageContent;