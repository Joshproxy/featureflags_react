import IFeatureflagServiceAPI from "../services/IFeatureflagServiceAPI";
import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import FormControl from 'react-bootstrap/FormControl';
import Application from "../models/Application";

export interface IApplicationConfigurationProps {
    service: IFeatureflagServiceAPI;
    saveCallback: (newApplication: Application) => void;
    cancelCallback: () => void;
}

export interface IApplicationConfigurationState {

    newApplicationName: string;
    newApplicationTenants: string[];
}

export default class ApplicationConfiguration extends React.Component<
    IApplicationConfigurationProps,
    IApplicationConfigurationState
    > {

    private readonly defaultTenants = ["DEV", "QA", "MOCK", "DEMO", "PROD"];

    public newTenantInputElement: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    constructor(props: IApplicationConfigurationProps) {
        super(props);
        this.state = {
            newApplicationName: "",
            newApplicationTenants: this.defaultTenants,
        };
    }

    public createNewApplication = () => {
        this.props.service
            .createNewApplication(
                this.state.newApplicationName,
                this.state.newApplicationTenants
            )
            .then(newApplication => {
                this.setState({
                    ...this.state,
                    newApplicationName: "",
                    newApplicationTenants: this.defaultTenants
                });
                this.props.saveCallback(newApplication);
            });
    }

    public cancelNewApplication = () => {
        this.setState({
            ...this.state,
            newApplicationName: "",
            newApplicationTenants: this.defaultTenants
        });
        this.props.cancelCallback();
    }


    public setNewApplicationName = (event: React.FormEvent<any>) => {
        const target = event.target as HTMLInputElement;
        this.setState({ ...this.state, newApplicationName: target.value });
    }


    public removeTenant = (id: string) => () => {
        this.setState({
            ...this.state,
            newApplicationTenants: this.state.newApplicationTenants.filter(
                t => t !== id
            )
        });
    }

    public addTenant = () => {
        let newTenantValue =
            this.newTenantInputElement.current !== null
                ? this.newTenantInputElement.current.value
                : "";
        if (!!newTenantValue) {
            let tenants = [...this.state.newApplicationTenants, newTenantValue];
            this.setState({
                ...this.state,
                newApplicationTenants: tenants
            });
            this.newTenantInputElement.current!.value = '';
        }
    }


    public render() {
        return <div className="smallForm">
            <InputGroup className="mb-3">
                <FormControl
                    type="text"
                    onChange={this.setNewApplicationName}
                    placeholder="New Application Name"
                />
                <InputGroup.Append>
                    <Button
                        variant="primary"
                        active={!!this.state.newApplicationName.length}
                        onClick={this.createNewApplication}
                    >
                        create
                </Button>
                    <Button
                        variant="secondary"
                        onClick={this.cancelNewApplication}
                    >
                        cancel
                </Button>
                </InputGroup.Append>
            </InputGroup>
            <h4>Tenants</h4>
            {this.state.newApplicationTenants.map((id: string, i: number) => (
                <InputGroup key={id}>
                    <InputGroup.Text className="form-control">{id}</InputGroup.Text>
                    <InputGroup.Append>
                        <Button variant="secondary" onClick={this.removeTenant(id)}>
                            remove
                  </Button>
                    </InputGroup.Append>
                </InputGroup>
            ))}
            <InputGroup>
                <input
                    type="text"
                    placeholder="New Tenant"
                    className="form-control"
                    ref={this.newTenantInputElement}
                />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={this.addTenant}>
                        add tenant
                </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    }
}