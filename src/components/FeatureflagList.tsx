import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import FeatureFlagListItem, {
  IFeatureFlagListItemProps
} from './FeatureflagListItem';

interface IFeatureflagListProps {
  service: IFeatureflagServiceAPI;
  applicationId: number;
}

interface IFeatureflagListState {
  featureFlags: Featureflag[];
  newFeatureName: string;
  featureFilter: string;
  tenants: { name: string; override: string }[];
}

export default class FeatureflagList extends Component<
  IFeatureflagListProps,
  IFeatureflagListState
> {
  public constructor(props: IFeatureflagListProps) {
    super(props);
    this.state = {
      featureFlags: [],
      newFeatureName: '',
      featureFilter: '',
      tenants: []
    };
    this.getFeatureflags();
  }

  private getFeatureflags = () => {
    this.props.service.get(this.props.applicationId).then(ffs => {
      let tenants = ffs.length
        ? ffs[0].tenants.map(t => {
            return { name: t.name, override: '' };
          })
        : this.state.tenants;
      this.setState({ ...this.state, featureFlags: ffs, tenants: tenants });
    });
  };

  componentDidUpdate = (previousProps: IFeatureflagListProps) => {
    if (this.props.applicationId !== previousProps.applicationId) {
      this.getFeatureflags();
    }
  };

  public setNewFeatureName = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, newFeatureName: target.value });
  };

  get tenantNames() {
    return this.state.tenants.map(t => t.name);
  }

  public createNewFeatureFlag = () => {
    const newFeatureflag = new Featureflag(
      this.state.newFeatureName,
      this.props.applicationId,
      this.tenantNames
    );
    this.props.service.save(newFeatureflag).then(f => {
      this.setState({...this.state, featureFlags: [...this.state.featureFlags, f]});
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

  public setOverride = (tenant: { name: string; override: string }) => (
    event: React.FormEvent<any>
  ) => {
    const target = event.target as HTMLInputElement;
    let updatedTenants = this.state.tenants.map(t =>
      t.name == tenant.name ? { ...t, override: target.value } : t
    );
    this.setState({ ...this.state, tenants: updatedTenants });
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

        <div className="tableFixHead">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">
                  <div>Name</div>
                </th>
                {this.state.tenants.map(t => (
                  <th key={t.name} scope="col" className="text-center">
                    <div>{t.name}</div>
                    <Form.Control
                      as="select"
                      onChange={this.setOverride(t)}
                      value={t.override}
                      style={{ width: 100 + 'px' }}
                    >
                      <option key="" value="" />
                      {this.tenantNames.map(a => (
                        <option key={a} value={a} disabled={a == t.name}>
                          {a}
                        </option>
                      ))}
                    </Form.Control>
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
                  overriddenTenants={this.state.tenants.filter(t => t.override).map(t => t.name)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
