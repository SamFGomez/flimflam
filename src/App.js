import logo from './logo.svg';
import './css/style.css';

import PageHeader from './components/PageHeader.js';
import PageContent from './components/PageContent.js';

function App() {

  return (
    <div>
      <PageHeader name = "Sam Test" />
      <PageContent />
    </div>
  );

}

export default App;
