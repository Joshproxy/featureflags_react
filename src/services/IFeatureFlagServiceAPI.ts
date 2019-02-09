import Featureflag from '../models/Featureflag';
import Application from '../models/Application';

export default interface IFeatureflagServiceAPI {
    get(applicationId?: number): Promise<Featureflag[]>;
    save(featureflag: Featureflag): Promise<Featureflag>;
    delete(id: number): Promise<void>;
    getApplications(): Promise<Application[]>;
    createNewApplication(name: string): Promise<Application>;
}
