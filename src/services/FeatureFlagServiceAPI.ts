import IFeatureFlagServiceAPI from './IFeatureFlagServiceAPI';
import FeatureFlag from '../models/FeatureFlag';

export default class FeatureFlagServiceAPI implements IFeatureFlagServiceAPI {
  private FeatureFlags: FeatureFlag[];

  constructor() {
    const   tenants = ["DEV", "QA", "MOCK", "DEMO", "PROD"];
    this.FeatureFlags = [
      new FeatureFlag("US12345", "EBSCONET", tenants),
      new FeatureFlag("US12346", "EBSCONET", tenants),
      new FeatureFlag("US12347", "EBSCONET", tenants),
      new FeatureFlag("US12348", "WIT", tenants),
    ];
  }

  get(application: string = ""): Promise<FeatureFlag[]> {
    return Promise.resolve(this.FeatureFlags.filter(f => !application || f.application == application));
  }

  save(featureflag: FeatureFlag): Promise<FeatureFlag> {
    if (featureflag.id == 0) {
      featureflag.id = this.FeatureFlags.length + 1;
      this.FeatureFlags.push(featureflag);
    }
    return Promise.resolve(featureflag);
  }
  delete(id: number): Promise<void> {
    this.FeatureFlags = this.FeatureFlags.filter(f => f.id != id);
    return Promise.resolve();
  }
}
