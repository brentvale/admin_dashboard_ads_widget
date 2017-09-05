import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AdUploadContainer from './components/ad_upload_container';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AdUploadContainer />
      </div>
    );
  }
}

export default App;
