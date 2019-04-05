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
    this.applications = [{ id: 1, name: 'EBSCONET', tenants: [...tenants] }, { id: 2, name: 'WIT', tenants: [...tenants] }]
    this.featureflags = [
      new Featureflag('F986', 1, tenants),
      new Featureflag('F987.US12346', 1, tenants),
      new Featureflag('F987.US12347', 1, tenants),
      new Featureflag('F987.US12348', 2, tenants)
    ];
    this.featureflags[0].rallyContextIds.push('F13529');
    this.featureflags[0].rallyContextIds.push('US12345');
    for (let i = 0; i < 100; i++) {
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

  getFeatureflags(applicationId: number = 0): Promise<Featureflag[]> {
    return Promise.resolve(
      this.featureflags.filter(
        f => !applicationId || f.applicationId == applicationId
      )
    );
  }

  saveFeatureflag(featureflag: Featureflag): Promise<Featureflag> {
    if (featureflag.id == 0) {
      featureflag.id = this.featureflags.length + 1;
      this.featureflags.push(featureflag);
    }
    return Promise.resolve(featureflag);
  }

  deleteFeatureflag(id: number): Promise<void> {
    this.featureflags = this.featureflags.filter(f => f.id != id);
    return Promise.resolve();
  }

  getApplication = (id: number): Promise<Application> => {
    return Promise.resolve(this.applications.filter(a => a.id === id)[0]);
  }

  getApplications(): Promise<Application[]> {
    return Promise.resolve(this.applications);
  }

  createNewApplication(name: string, tenants: string[]): Promise<Application> {
    const application = { id: this.applications.length + 1, name, tenants };
    this.applications.push(application);
    return Promise.resolve(application);
  }

  addTenant(id: number, newTenantName: string): Promise<void> {
    return this.getApplication(id)
      .then(a => {
        a.tenants
          .push(newTenantName);
        this.featureflags
          .filter(ff => ff.applicationId === id)
          .forEach(ff => ff.tenants.push({ name: newTenantName, active: false }));
      });
  }
}
