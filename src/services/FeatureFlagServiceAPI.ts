import IFeatureflagServiceAPI from './IFeatureflagServiceAPI';
import Featureflag from '../models/Featureflag';

export default class FeatureFlagServiceAPI implements IFeatureflagServiceAPI {
  private FeatureFlags: Featureflag[];

  constructor() {
    const tenants = ['DEV', 'QA', 'MOCK', 'DEMO', 'PROD'];
    this.FeatureFlags = [
      new Featureflag('US12345', 'EBSCONET', tenants),
      new Featureflag('US12346', 'EBSCONET', tenants),
      new Featureflag('US12347', 'EBSCONET', tenants),
      new Featureflag('US12348', 'WIT', tenants)
    ];
    let id = 1;
    this.FeatureFlags.forEach(f => {
      f.id = id++;
    });
  }

  get(application: string = ''): Promise<Featureflag[]> {
    return Promise.resolve(
      this.FeatureFlags.filter(
        f => !application || f.application == application
      )
    );
  }

  save(featureflag: Featureflag): Promise<Featureflag> {
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
