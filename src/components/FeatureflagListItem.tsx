import * as React from 'react';
import Featureflag from '../models/Featureflag';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import FeatureFlag from '../models/Featureflag';

export interface IFeatureFlagListItemProps {
  service: IFeatureflagServiceAPI;
  featureflag: Featureflag;
}

export interface IFeatureFlagListItemState {
  featureflag: Featureflag;
  editing: boolean;
  saving: boolean;
}

export default class FeatureFlagListItem extends React.Component<
  IFeatureFlagListItemProps,
  IFeatureFlagListItemState
> {
  private beforeEditState: FeatureFlag;

  public constructor(props: IFeatureFlagListItemProps) {
    super(props);
    this.beforeEditState = this.props.featureflag;
    this.state = {
      featureflag: this.props.featureflag,
      editing: false,
      saving: false
    };
  }

  public setTenant = (tenant: string, active: boolean) => () => {
    this.state.featureflag.tenants[tenant] = active;
    this.setState(this.state);
  };

  public save = () => {
    this.setState({ ...this.state, saving: true });
    this.props.service.save(this.state.featureflag).then(f => {
      this.setState({ featureflag: f, editing: false, saving: false });
    });
  };

  public edit = () => {
    this.beforeEditState = { ...this.state.featureflag };
    this.setState({ ...this.state, editing: true });
  };

  public cancelEdit = () => {
    this.setState({
      ...this.state,
      featureflag: this.beforeEditState,
      editing: false
    });
  };

  public delete = () => {
    this.setState({ ...this.state, saving: true });
    this.props.service.delete(this.state.featureflag.id);
  };

  private getTenantArray = (): { name: string; checked: boolean }[] => {
    return Object.entries(this.state.featureflag.tenants).map(
      ([key, value]) => {
        return { name: key, checked: value };
      }
    );
  };

  public render() {
    const f = this.state.featureflag;
    const tenantArray = this.getTenantArray();
    return (
      <div className="row">
        <div className="col-sm">{f.application}</div>
        <div className="col-sm">{f.name}</div>
        {tenantArray.map(t => (
          <div className="col-sm">
            <input
              name="isGoing"
              type="checkbox"
              checked={t.checked}
              disabled={!this.state.editing}
              onChange={this.setTenant(t.name, !t.checked)}
            />
          </div>
        ))}
        <div className="col-sm">{f.createDate.toLocaleDateString()}</div>
        <div className="col-sm">
          {f.expirationDate ? f.expirationDate.toLocaleDateString() : 'none'}
        </div>

        {this.state.editing ? (
          <div className="col-sm">
          <ButtonGroup>
            <Button variant="success" active={!this.state.saving} onClick={this.save}>Save</Button>
            <Button variant="secondary" active={!this.state.saving} onClick={this.cancelEdit}>Cancel</Button>
            </ButtonGroup>
          </div>
        ) : (
          <div className="col-sm">
          <ButtonGroup>
            <Button variant="primary" active={!this.state.saving} onClick={this.edit}>Edit</Button>
            <Button variant="danger" active={!this.state.saving} onClick={this.delete}>Delete</Button>
            </ButtonGroup>
          </div>
        )}
      </div>
    );
  }
}
