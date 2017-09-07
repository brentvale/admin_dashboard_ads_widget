import React, { Component } from 'react';
import './App.css';
import AdUploadContainer from './components/ad_upload_container';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <AdUploadContainer />
      </div>
    );
  }
}
