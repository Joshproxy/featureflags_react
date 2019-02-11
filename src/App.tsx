import './App.css';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import FeatureFlagList from './components/FeatureflagList_';
import Application from './models/Application';
import FeatureFlagServiceAPI from './services/FeatureflagServiceAPI_';
import IFeatureflagServiceAPI from './services/IFeatureflagServiceAPI_';

class App extends Component<
  {},
  {
    applications: Application[];
    selectedApplication: Application | null;
    newApplicationName: string;
  }
> {
  private service: IFeatureflagServiceAPI;
  constructor(props: any) {
    super(props);
    this.service = new FeatureFlagServiceAPI();
    this.state = {
      applications: [],
      selectedApplication: null,
      newApplicationName: ''
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
          selectedApplication: newApplication
        });
      });
  };

  public setNewApplicationName = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, newApplicationName: target.value });
  };

  public setApplication = () => {};

  render() {
    let applicationNames = this.state.applications.length
      ? this.state.applications
          .map(a => a.name)
          .filter((v, i, a) => a.indexOf(v) === i)
      : [];
    return (
      <div className="App">
        <header className="App-header">Feature Flags</header>
        <Form.Group controlId="applicationSelect">
          <Form.Label>Application</Form.Label>
          <Form.Control as="select" multiple>
            {this.state.applications.map(a => (
              <option value={a.id}>{a.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
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
                Create New Application
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
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
