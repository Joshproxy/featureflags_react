import React, { Component } from 'react';
import './App.css';
import IFeatureflagServiceAPI from './services/IFeatureflagServiceAPI';
import FeatureFlagServiceAPI from './services/FeatureflagServiceAPI';
import FeatureFlagList from './components/FeatureflagList';

class App extends Component {
  private service: IFeatureflagServiceAPI;
  constructor() {
    super({});
    this.service = new FeatureFlagServiceAPI();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Feature Flags
        </header>
        <FeatureFlagList service={this.service}></FeatureFlagList>
      </div>
    );
  }
}

export default App;
