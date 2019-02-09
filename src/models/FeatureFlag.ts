export default class FeatureFlag {
  public id: number = 0;
  public name: string = '';
  public applicationId: number = 0;
  public tenants: Array<{ name: string; active: boolean }> = [];
  public createDate: Date = new Date();
  public expirationDate: Date | null = null;

  constructor(name: string, applicationId: number, tenants: string[]) {
    this.name = name;
    this.applicationId = applicationId;
    this.tenants = tenants.map(t => {
      return { name: t, active: false };
    });
  }
}
