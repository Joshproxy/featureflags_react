import Application from '../models/Application';
import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from './IFeatureflagServiceAPI';

export default class FeatureFlagServiceAPI implements IFeatureflagServiceAPI {
  private featureflags: Featureflag[];
  private applications: Application[];

  constructor() {
    const tenants = ['DEV', 'QA', 'MOCK', 'DEMO', 'PROD'];
    this.applications = [{id: 1, name: 'EBSCONET'}, {id: 2, name: 'WIT'}]
    this.featureflags = [
      new Featureflag('US12345', 1, tenants),
      new Featureflag('US12346', 1, tenants),
      new Featureflag('US12347', 1, tenants),
      new Featureflag('US12348', 2, tenants)
    ];
    let id = 1;
    this.featureflags.forEach(f => {
      f.id = id++;
    });
    this.featureflags[2].tenants[0].active = true;
    this.featureflags[2].tenants[1].active = true;
    this.featureflags[2].tenants[2].active = true;
    this.featureflags[3].tenants[0].active = true;
  }

  get(applicationId: number = 0): Promise<Featureflag[]> {
    return Promise.resolve(
      this.featureflags.filter(
        f => !applicationId || f.applicationId == applicationId
      )
    );
  }

  save(featureflag: Featureflag): Promise<Featureflag> {
    if (featureflag.id == 0) {
      featureflag.id = this.featureflags.length + 1;
      this.featureflags.push(featureflag);
    }
    return Promise.resolve(featureflag);
  }

  delete(id: number): Promise<void> {
    this.featureflags = this.featureflags.filter(f => f.id != id);
    return Promise.resolve();
  }

  getApplications(): Promise<Application[]> {
    return Promise.resolve(this.applications);
  }

  createNewApplication(name: string): Promise<Application> {
    const application = {id: this.applications.length + 1, name: name};
    this.applications.push(application);
    return Promise.resolve(application);
  }
}
