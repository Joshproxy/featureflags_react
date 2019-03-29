import Application from '../models/Application';
import Featureflag from '../models/Featureflag';
import IFeatureflagServiceAPI from './IFeatureflagServiceAPI';

export default class FeatureFlagServiceAPI implements IFeatureflagServiceAPI {
  private featureflags: Featureflag[] = [];
  private applications: Application[] = [];

  constructor() {
    this.createMockedData();
  }

  private createMockedData = () => {
    const tenants = ['DEV', 'QA', 'MOCK', 'DEMO', 'PROD'];
    this.applications = [{id: 1, name: 'EBSCONET'}, {id: 2, name: 'WIT'}]
    this.featureflags = [
      new Featureflag('F986', 1, tenants),
      new Featureflag('F987.US12346', 1, tenants),
      new Featureflag('F987.US12347', 1, tenants),
      new Featureflag('F987.US12348', 2, tenants)
    ];
    this.featureflags[0].rallyContextIds.push('F13529');
    this.featureflags[0].rallyContextIds.push('US12345');
    for(let i = 0; i< 100; i++) {
      let newFF = new Featureflag('US1111' + i, 1, tenants);      
      newFF.createDate.setDate(newFF.createDate.getDate() - i);
      newFF.tenants[4].active = i % 2 == 0;
      this.featureflags.push(newFF);
    }
    this.featureflags.sort((a, b) => a.name.localeCompare(b.name));
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
