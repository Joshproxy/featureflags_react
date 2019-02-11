import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Application from '../models/Application';
import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';

export interface IFeatureFlagListItemProps {
  service: IFeatureflagServiceAPI;
  featureflag: Featureflag;
  application: Application
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
  private beforeEditState: Featureflag;

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
    this.state.featureflag.tenants = this.state.featureflag.tenants.map(t =>
      t.name === tenant ? { ...t, active: active } : t
    );
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

  public render() {
    const f = this.state.featureflag;
    return (
      <tr>
        <td>{this.props.application.name}</td>
        <td>{f.name}</td>
        {f.tenants.map(t => (
          <td key={t.name}>
            <input              
              name="isGoing"
              type="checkbox"
              checked={t.active}
              disabled={!this.state.editing}
              onChange={this.setTenant(t.name, !t.active)}
            />
          </td>
        ))}
        <td>{f.createDate.toLocaleDateString()}</td>
        <td>
          {f.expirationDate ? f.expirationDate.toLocaleDateString() : 'none'}
        </td>

        {this.state.editing ? (
          <td>
            <ButtonGroup>
              <Button
                variant="success"
                active={!this.state.saving}
                onClick={this.save}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                active={!this.state.saving}
                onClick={this.cancelEdit}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </td>
        ) : (
          <td>
            <ButtonGroup>
              <Button
                variant="primary"
                active={!this.state.saving}
                onClick={this.edit}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                active={!this.state.saving}
                onClick={this.delete}
              >
                Delete
              </Button>
            </ButtonGroup>
          </td>
        )}
      </tr>
    );
  }
}
