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
    selectedApplicationId: number;
    newApplicationName: string;
    newApplicationTenants: string[];
    creatingApplication: boolean;
  }
> {
  private service: IFeatureflagServiceAPI;
  private readonly defaultTenants = ["DEV", "QA", "MOCK", "DEMO", "PROD"];
  constructor(props: any) {
    super(props);
    this.service = new FeatureFlagServiceAPI();

    this.state = {
      applications: [],
      selectedApplicationId: 0,
      newApplicationName: "",
      newApplicationTenants: this.defaultTenants,
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

  public newTenantInputElement = React.createRef<HTMLInputElement>();

  public createNewApplication = () => {
    this.service
      .createNewApplication(
        this.state.newApplicationName,
        this.state.newApplicationTenants
      )
      .then(newApplication => {
        this.setState({
          ...this.state,
          selectedApplicationId: newApplication.id,
          newApplicationName: "",
          newApplicationTenants: this.defaultTenants,
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
    this.setState({
      ...this.state,
      selectedApplicationId: parseInt(target.value)
    });
  }

  public removeTenant = (id: string) => () => {
    this.setState({
      ...this.state,
      newApplicationTenants: this.state.newApplicationTenants.filter(
        t => t !== id
      )
    });
  }

  public addTenant = () => {
    let newTenantValue =
      this.newTenantInputElement.current !== null
        ? this.newTenantInputElement.current.value
        : "";
    if (!!newTenantValue) {
      let tenants = [...this.state.newApplicationTenants, newTenantValue];
      this.setState({
        ...this.state,
        newApplicationTenants: tenants
      });
      this.newTenantInputElement.current!.value = '';
    }
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
                  onClick={() =>
                    this.setState({ ...this.state, creatingApplication: true })
                  }
                >
                  create new application
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
                  onClick={() =>
                    this.setState({ ...this.state, creatingApplication: false })
                  }
                >
                  cancel
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <h4>Tenants</h4>
            {this.state.newApplicationTenants.map((id: string, i: number) => (
              <InputGroup key={id}>
                <InputGroup.Text className="form-control">{id}</InputGroup.Text>
                <InputGroup.Append>
                  <Button variant="secondary" onClick={this.removeTenant(id)}>
                    remove
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            ))}
            <InputGroup>
              <input
                type="text"
                placeholder="New Tenant"
                className="form-control"
                ref={this.newTenantInputElement}
              />
              <InputGroup.Append>
                <Button variant="secondary" onClick={this.addTenant}>
                  add tenant
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {!this.state.creatingApplication &&
          this.state.selectedApplicationId && (
            <FeatureFlagList
              service={this.service}
              applicationId={this.state.selectedApplicationId}
            />
          )}
      </div>
    );
  }
}

export default App;
