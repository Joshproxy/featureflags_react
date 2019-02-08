import Featureflag from '../models/Featureflag';

export default interface IFeatureflagServiceAPI {
    get(application?: string): Promise<Featureflag[]>;
    save(featureflag: Featureflag): Promise<Featureflag>;
    delete(id: number): Promise<void>;
}
