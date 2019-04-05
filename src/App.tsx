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
import ApplicationConfiguration from './components/ApplicationConfiguration';
import { AddTenantModal } from './components/AddTenantModal';

class App extends Component<
  {},
  {
    applications: Application[];
    selectedApplicationId: number;
    creatingApplication: boolean;
  }
  > {
  private service: IFeatureflagServiceAPI;
  private featureFlagListComponent: React.RefObject<FeatureFlagList> = React.createRef<FeatureFlagList>();
  private addTenantModal: React.RefObject<AddTenantModal> = React.createRef<AddTenantModal>();

  constructor(props: any) {
    super(props);
    this.service = new FeatureFlagServiceAPI();

    this.state = {
      applications: [],
      selectedApplicationId: 0,
      creatingApplication: false
    };

    this.service.getApplications().then(apps => {
      this.setState({
        ...this.state,
        applications: apps,
        selectedApplicationId: apps[0].id
      });
    });
  }

  public newApplicationCreated = (newApplication: Application) => {
    this.setState({
      ...this.state,
      selectedApplicationId: newApplication.id,
      creatingApplication: false
    });
  }

  public cancelNewApplication = () => {
    this.setState({ ...this.state, creatingApplication: false })
  }

  public selectApplication = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({
      ...this.state,
      selectedApplicationId: parseInt(target.value)
    });
  }

  public summonAddTenantModal = () => {
    this.addTenantModal.current!.handleShow();
  }

  public addTenant = (newTenantName: string) => {
    this.service
      .addTenant(this.state.selectedApplicationId, newTenantName)
      .then(() => {
        this.addTenantModal.current!.handleClose();
        this.featureFlagListComponent.current!.getData();
      })
  }

  render() {
    let applicationNames = this.state.applications.length
      ? this.state.applications
        .map(a => a.name)
        .filter((v, i, a) => a.indexOf(v) === i)
      : [];
    return (
      <div className="App">
        <AddTenantModal
          addTenant={this.addTenant}
          ref={this.addTenantModal}
        ></AddTenantModal>
        <header className="App-header mb-3">Feature Flags</header>

        {!this.state.creatingApplication && (
          <div className="smallForm">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">application</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                as="select"
                onChange={this.selectApplication}
                value={this.state.selectedApplicationId.toString()}
              >
                {this.state.applications.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Form.Control>
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  onClick={this.summonAddTenantModal                  }
                >
                  add tenant
                </Button>
              </InputGroup.Append>
              <InputGroup.Append>
                <Button
                  variant="primary"
                  onClick={() =>
                    this.setState({ ...this.state, creatingApplication: true })
                  }
                >
                  create
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {this.state.creatingApplication && (
          <ApplicationConfiguration
            service={this.service}
            saveCallback={this.newApplicationCreated}
            cancelCallback={this.cancelNewApplication}
          ></ApplicationConfiguration>
        )}
        {!this.state.creatingApplication &&
          this.state.selectedApplicationId && (
            <FeatureFlagList
              service={this.service}
              applicationId={this.state.selectedApplicationId}
              ref={this.featureFlagListComponent}
            />
          )}
      </div>
    );
  }
}

export default App;
