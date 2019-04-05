import 'react-datepicker/dist/react-datepicker.css';

import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DatePicker from 'react-datepicker';

import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import ConfirmModal from './ConfirmModal';

export interface IFeatureFlagListItemProps {
  service: IFeatureflagServiceAPI;
  featureflag: Featureflag;
  overriddenTenants: string[];
  onDelete: () => void;
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
  private confirmationModal: React.RefObject<ConfirmModal> = React.createRef<ConfirmModal>();

  private readonly rallyBase = 'https://rally1.rallydev.com/#/search?keywords=';

  public constructor(props: IFeatureFlagListItemProps) {
    super(props);
    this.beforeEditState = this.props.featureflag;
    this.state = {
      featureflag: this.props.featureflag,
      editing: false,
      saving: false
    };
  }

  public rallyUrl = (rallyId: string) =>
    rallyId === '' ? '' : this.rallyBase + rallyId;

  public setTenant = (tenant: string, active: boolean) => () => {
    this.state.featureflag.tenants = this.state.featureflag.tenants.map(t =>
      t.name === tenant ? { ...t, active: active } : t
    );
    this.setState(this.state);
  };

  public setExpiration = (expiration: Date) => {
    this.state.featureflag.expirationDate = expiration;
    this.setState(this.state);
  };

  public addRallyId = () => {
    this.state.featureflag.rallyContextIds = [
      ...this.state.featureflag.rallyContextIds,
      ''
    ];
    this.setState({ ...this.state, featureflag: this.state.featureflag });
  };

  public setRallyId = (index: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.state.featureflag.rallyContextIds[index] = event.currentTarget.value;
    this.setState(this.state);
  };

  public save = () => {
    this.setState({ ...this.state, saving: true });
    this.props.service.saveFeatureflag(this.state.featureflag).then(f => {
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
    this.confirmationModal.current!.open(() => {
      this.props.service.deleteFeatureflag(this.state.featureflag.id)
        .then(() => {
          this.setState({ ...this.state, saving: false });
          this.props.onDelete();
        });
    });
  };

  public render() {
    const f = this.state.featureflag;
    const rowClassname = f.expirationDate == null ? '' : 'expiringFlag';
    return (
      <tr className={rowClassname}>
        <td>{f.name}</td>
        <td>
          {f.rallyContextIds.map((id: string, i: number) =>
            this.state.editing ? (
              <div key={i}>
                <input
                  name={'rallyId_' + id}
                  type="text"
                  value={id}
                  onChange={this.setRallyId(i)}
                />
              </div>
            ) : (
                <div key={i}>
                  <a href={this.rallyUrl(id)}>{id}</a>
                </div>
              )
          )}
          {this.state.editing && (
            <button name="newId" onClick={this.addRallyId}>
              add
            </button>
          )}
        </td>
        {f.tenants.map(t => {
          let c = this.props.overriddenTenants.some(tn => tn == t.name)
            ? 'overriddenTenant'
            : '';
          return (
            <td key={t.name} className={'text-center ' + c}>
              <input
                name="isGoing"
                type="checkbox"
                checked={t.active}
                disabled={!this.state.editing}
                onChange={this.setTenant(t.name, !t.active)}
              />
            </td>
          );
        })}

        <td className="text-center" title={f.createDate.toLocaleTimeString()}>
          {f.createDate.toLocaleDateString()}
        </td>
        <td className="text-center">
          {this.state.editing ? (
            <DatePicker
              onChange={this.setExpiration}
              selected={f.expirationDate}
            />
          ) : f.expirationDate ? (
            f.expirationDate.toLocaleDateString()
          ) : (
                'none'
              )}
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
              <ConfirmModal
                ref={this.confirmationModal}
                show={false}
                confirm={() => null}
                cancel={() => null}
                titleText='Confirm Delete'
                mainText='Are you sure?'
                cancelButtonName='cancel'
                confirmButtonName='delete'
              ></ConfirmModal>
            </td>
          )}
      </tr>
    );
  }
}
