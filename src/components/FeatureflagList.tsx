import React, { Component } from 'react';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import Featureflag from '../models/Featureflag';
import FeatureFlagListItem from './FeatureflagListItem';
import Button from 'react-bootstrap/Button';
import Application from '../models/Application';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

interface FeatureflagListProps {
  service: IFeatureflagServiceAPI;
  application: Application;
}

interface FeatureflagListState {
  featureFlags: Featureflag[];
  newFeatureName: string;
  featureFilter: string;
}

export default class FeatureflagList extends Component<
  FeatureflagListProps,
  FeatureflagListState
> {
  public constructor(props: FeatureflagListProps) {
    super(props);
    this.state = {
      featureFlags: [],
      newFeatureName: '',
      featureFilter: ''
    };
    props.service.get().then(ffs => {
      this.setState({ ...this.state, featureFlags: ffs });
    });
  }

  public setNewFeatureName = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, newFeatureName: target.value });
  };

  get tenantNames() {
    return this.state.featureFlags.length
      ? this.state.featureFlags[0].tenants.map(t => t.name)
      : [];
  }

  public createNewFeatureFlag = () => {
    const newFeatureflag = new Featureflag(
      this.state.newFeatureName,
      this.props.application.id,
      this.tenantNames
    );
    this.props.service.save(newFeatureflag).then(f => {
      this.state.featureFlags.push(f);
      this.clearInput('newFeatureNameInput');
    });
  };

  public clearInput = (refName: string) => {
    (this.refs[refName] as HTMLInputElement).value = '';
  };

  public setFeatureFilter = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, featureFilter: target.value });
  };

  public clearFilter = () => {
    this.clearInput('featureFilterInput');
    this.setState({ ...this.state, featureFilter: '' });
  };

  public getFilteredFeatureflags = () => {
    return this.state.featureFlags.filter(
      f =>
        !this.state.featureFilter ||
        f.name.toLowerCase().indexOf(this.state.featureFilter.toLowerCase()) !==
          -1
    );
  };

  public render(): JSX.Element {
    return (
      <div className="featureflagList">
        <div className="smallForm">
          <InputGroup className="mb-3">
            <FormControl
              ref="newFeatureNameInput"
              onChange={this.setNewFeatureName}
              placeholder="New Feature Name"
            />
            <InputGroup.Append>
              <Button
                variant="primary"
                active={!!this.state.newFeatureName.length}
                onClick={this.createNewFeatureFlag}
              >
                Create New Featureflag
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>

        <div className="smallForm">
          <InputGroup className="mb-3">
            <FormControl
              ref="featureFilterInput"
              onChange={this.setFeatureFilter}
              placeholder="Feature Filter"
            />
            <InputGroup.Append>
              <Button
                variant="primary"
                active={!!this.state.featureFilter.length}
                onClick={this.clearFilter}
              >
                X
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>

        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Application</th>
              <th scope="col">Name</th>
              {this.tenantNames.map(t => (
                <th key={t} scope="col">
                  {t}
                </th>
              ))}
              <th scope="col">Creation Date</th>
              <th scope="col">Expiration Date</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {this.getFilteredFeatureflags().map(f => (
              <FeatureFlagListItem
                key={f.id}
                featureflag={f}
                service={this.props.service}
                application={this.props.application}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
