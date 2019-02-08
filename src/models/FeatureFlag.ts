export default class FeatureFlag {
  public id: number = 0;
  public name: string = '';
  public application: string = 'unknown';
  public tenants: { [key: string]: boolean } = {};
  public createDate: Date = new Date();
  public expirationDate: Date | null = null;

  constructor(name: string, application: string, tenants: string[]) {
    this.name = name;
    this.application = application;
    tenants.forEach(t => {
      this.tenants[t] = false;
    });
  }

}
