import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React from "react";

interface IAddTenantModalProps {
    addTenant: (newTenant: string) => void;
}

interface IAddTenantModalState {
    show: boolean;
    newTenantName: string;
}

export class AddTenantModal extends React.Component<IAddTenantModalProps, IAddTenantModalState> {
    constructor(props: IAddTenantModalProps, context: IAddTenantModalState) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            newTenantName: ''
        };
    }

    public newTenantInputElement = React.createRef<HTMLInputElement>();

    public addTenant = () => {
        let newTenantValue =
            this.newTenantInputElement.current !== null
                ? this.newTenantInputElement.current.value
                : "";
        if (!!newTenantValue) {
            this.props.addTenant(newTenantValue);
            this.newTenantInputElement.current!.value = '';
            this.handleClose();
        }
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        return (
            <>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add another tenant</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            type="text"
                            placeholder="New Tenant"
                            className="form-control"
                            ref={this.newTenantInputElement}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.addTenant}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}