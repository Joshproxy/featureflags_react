import './App.css';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import FeatureFlagList from './components/FeatureflagList';
import Application from './models/Application';
import FeatureFlagServiceAPI from './services/FeatureflagServiceAPI';
import IFeatureflagServiceAPI from './services/IFeatureflagServiceAPI';

class App extends Component<
  {},
  {
    applications: Application[];
    selectedApplication: Application | null;
    newApplicationName: string;
    creatingApplication: boolean;
  }
> {
  private service: IFeatureflagServiceAPI;
  constructor(props: any) {
    super(props);
    this.service = new FeatureFlagServiceAPI();
    this.state = {
      applications: [],
      selectedApplication: null,
      newApplicationName: "",
      creatingApplication: false
    };

    this.service.getApplications().then(apps => {
      this.setState({
        ...this.state,
        applications: apps,
        selectedApplication: apps[0]
      });
    });
  }

  public createNewApplication = () => {
    this.service
      .createNewApplication(this.state.newApplicationName)
      .then(newApplication => {
        this.setState({
          ...this.state,
          applications: [...this.state.applications, newApplication],
          selectedApplication: newApplication, 
          creatingApplication: false
        });
      });
  }

  public setNewApplicationName = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, newApplicationName: target.value });
  }

  public selectApplication = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    const app = this.state.applications.filter(a => a.id === parseInt(target.value))[0];
    this.setState({ ...this.state, selectedApplication: app });
  }

  public setApplication = () => {};

  render() {
    let applicationNames = this.state.applications.length
      ? this.state.applications
          .map(a => a.name)
          .filter((v, i, a) => a.indexOf(v) === i)
      : [];
    return (
      <div className="App">
        <header className="App-header mb-3">Feature Flags</header>

        {!this.state.creatingApplication && (
          <div className="smallForm">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">application</InputGroup.Text>
              <Form.Control as="select" onChange={this.selectApplication}>
                {this.state.applications.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Form.Control>
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({...this.state, creatingApplication: true})}
                >
                  create new
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {this.state.creatingApplication && (
          <div className="smallForm">
            <InputGroup className="mb-3">
              <FormControl
                type="text"
                onChange={this.setNewApplicationName}
                placeholder="New Application Name"
              />
              <InputGroup.Append>
                <Button
                  variant="primary"
                  active={!!this.state.newApplicationName.length}
                  onClick={this.createNewApplication}
                >
                  create
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => this.setState({...this.state, creatingApplication: false})}
                >
                  cancel
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {this.state.selectedApplication && (
          <FeatureFlagList
            service={this.service}
            application={this.state.selectedApplication!}
          />
        )}
      </div>
    );
  }
}

export default App;
