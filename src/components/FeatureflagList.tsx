import React, { Component } from 'react';
import IFeatureflagServiceAPI from '../services/IFeatureflagServiceAPI';
import Featureflag from '../models/Featureflag';
import FeatureFlagListItem from './FeatureflagListItem';

interface FeatureflagListProps {
  service: IFeatureflagServiceAPI;
}

interface FeatureflagListState {
  featureFlags: Featureflag[];
}

export default class FeatureflagList extends Component<
  FeatureflagListProps,
  FeatureflagListState
> {
  public constructor(props: FeatureflagListProps) {
    super(props);
    this.state = {
      featureFlags: []
    };
    props.service.get().then(ffs => {
      this.setState({ ...this.state, featureFlags: ffs });
    });
  }

  public render(): JSX.Element {
    return (
      <div className="container">
        {this.state.featureFlags.map(f => (
          <FeatureFlagListItem
            key={f.id}
            featureflag={f}
            service={this.props.service}
          />
        ))}
      </div>
    );
  }
}
