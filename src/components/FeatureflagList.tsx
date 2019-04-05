import './FeatureflagList.css';

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import Application from '../models/Application';
import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import FeatureFlagListItem, { IFeatureFlagListItemProps } from './FeatureflagListItem';
import ConfirmModal from './ConfirmModal';

interface IFeatureflagListProps {
  service: IFeatureflagServiceAPI;
  applicationId: number;
}

interface IFeatureflagListState {
  featureFlags: Featureflag[];
  newFeatureName: string;
  featureFilter: string;
  tenants: { name: string; override: string }[];
  featureFlagSort: (ffA: Featureflag, ffB: Featureflag) => number;
}

export default class FeatureflagList extends Component<
  IFeatureflagListProps,
  IFeatureflagListState
  > {

  public constructor(props: IFeatureflagListProps) {
    super(props);
    this.state = {
      featureFlags: [],
      newFeatureName: "",
      featureFilter: "",
      tenants: [],
      featureFlagSort: this.featureflagCreateDateSort
    };
    this.getData();
  }

  public getData = () => this.getTenants().then(() => this.getFeatureflags());

  private getTenants = () => {
    return this.props.service.getApplications().then(apps => {
      let tenants = apps
        .filter(a => a.id === this.props.applicationId)[0]
        .tenants.map(t => {
          return { name: t, override: "" };
        });
      this.setState({
        ...this.state,
        tenants
      });
      return tenants;
    });
  }

  private getFeatureflags = () => {
    return this.props.service.getFeatureflags(this.props.applicationId).then(ffs => {
      this.setState({ ...this.state, featureFlags: ffs });
      return ffs;
    });
  }

  componentDidUpdate = (previousProps: IFeatureflagListProps) => {
    if (this.props.applicationId !== previousProps.applicationId) {
      this.getData();
    }
  }

  public setNewFeatureName = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, newFeatureName: target.value });
  }

  get tenantNames() {
    return this.state.tenants.map(t => t.name);
  }

  public createNewFeatureFlag = () => {
    const newFeatureflag = new Featureflag(
      this.state.newFeatureName,
      this.props.applicationId,
      this.tenantNames
    );
    this.props.service.saveFeatureflag(newFeatureflag).then(f => {
      this.setState({
        ...this.state,
        featureFlags: [...this.state.featureFlags, f]
      });
      this.clearInput("newFeatureNameInput");
    });
  }

  public clearInput = (refName: string) => {
    (this.refs[refName] as HTMLInputElement).value = "";
  }

  public setFeatureFilter = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement;
    this.setState({ ...this.state, featureFilter: target.value });
  }

  public setOverride = (tenant: { name: string; override: string }) => (
    event: React.FormEvent<any>
  ) => {
    const target = event.target as HTMLInputElement;
    let updatedTenants = this.state.tenants.map(t =>
      t.name == tenant.name ? { ...t, override: target.value } : t
    );
    this.setState({ ...this.state, tenants: updatedTenants });
  }

  public clearFilter = () => {
    this.clearInput("featureFilterInput");
    this.setState({ ...this.state, featureFilter: "" });
  }

  public getFilteredFeatureflags = (): Featureflag[] => {
    const filterValue = this.state.featureFilter.toLowerCase();
    return this.state.featureFlags.filter(
      f =>
        !filterValue ||
        f.rallyContextIds.some(
          rc => rc.toLowerCase().indexOf(filterValue) !== -1
        ) ||
        f.name.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  private featureflagCreateDateSort = (
    ffA: Featureflag,
    ffB: Featureflag
  ): number => {
    return ffB.createDate.valueOf() - ffA.createDate.valueOf();
  }

  private featureflagTenantSort = (tenant: string) => (
    ffA: Featureflag,
    ffB: Featureflag
  ): number => {
    const tenantActive = (ff: Featureflag) =>
      ff.tenants.filter(t => t.name === tenant)[0].active;
    const ffA_active = tenantActive(ffA);
    if (ffA_active === tenantActive(ffB)) {
      return this.featureflagCreateDateSort(ffA, ffB);
    }
    return ffA_active ? -1 : 1;
  }

  public applyFeatureflagSort = (
    featureflags: Featureflag[]
  ): Featureflag[] => {
    return featureflags.sort(this.state.featureFlagSort);
  }

  public setFeatureflagSort = (tenant: string = "") => () => {
    const sortFunc =
      tenant !== ""
        ? this.featureflagTenantSort(tenant)
        : this.featureflagCreateDateSort;
    this.setState({ ...this.state, featureFlagSort: sortFunc });
  }

  public onFeatureFlagDelete = () => {
    this.getFeatureflags();
  }

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
                create new flag
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
                clear
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
                <th scope="col">
                  <div>Rally</div>
                </th>
                {this.state.tenants.map(t => (
                  <th key={t.name} scope="col" className="text-center">
                    <div
                      className="sortField"
                      onClick={this.setFeatureflagSort(t.name)}
                    >
                      {t.name}
                    </div>
                    <Form.Control
                      as="select"
                      onChange={this.setOverride(t)}
                      value={t.override}
                      style={{ width: 100 + "px", display: "inline-block" }}
                    >
                      <option key="" value="">
                        ----
                      </option>
                      {this.tenantNames
                        .filter(tName => tName !== t.name)
                        .map(a => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                    </Form.Control>
                  </th>
                ))}
                <th scope="col" className="text-center">
                  <div
                    className="sortField "
                    onClick={this.setFeatureflagSort()}
                  >
                    Creation Date
                  </div>
                </th>
                <th scope="col" className="text-center">
                  Expiration Date
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.applyFeatureflagSort(this.getFilteredFeatureflags()).map(
                f => (
                  <FeatureFlagListItem
                    key={f.id}
                    featureflag={f}
                    service={this.props.service}
                    overriddenTenants={this.state.tenants
                      .filter(t => t.override)
                      .map(t => t.name)}
                    onDelete={this.onFeatureFlagDelete}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
