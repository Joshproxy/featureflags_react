import FeatureFlag from '../models/FeatureFlag';

export default interface IFeatureFlagServiceAPI {
    get(application: string): Promise<FeatureFlag[]>;
    save(featureflag: FeatureFlag): Promise<FeatureFlag>;
    delete(id: number): Promise<void>;
}
