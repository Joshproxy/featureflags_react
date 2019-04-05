import Application from '../models/Application';
import Featureflag from '../models/Featureflag';

export default interface IFeatureflagServiceAPI {
    getFeatureflags(applicationId?: number): Promise<Featureflag[]>;
    saveFeatureflag(featureflag: Featureflag): Promise<Featureflag>;
    deleteFeatureflag(id: number): Promise<void>;
    getApplication(id: number): Promise<Application>;
    getApplications(): Promise<Application[]>;
    createNewApplication(name: string, tenants: string[]): Promise<Application>;
    addTenant(id: number, newTenantName: string): Promise<void>;
}
