import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React from "react";

interface IConfirmModalProps {
    show: boolean;
    confirm: () => void;
    cancel: () => void;
    titleText: string;
    mainText: string;
    cancelButtonName: string;
    confirmButtonName: string;
}

type IConfirmModalDefaultProps = {
    show: false,
    confirm: () => void,
    cancel: () => void,
    titleText: 'Confirm',
    mainText: 'Are you sure?',
    cancelButtonName: 'No',
    confirmButtonName: 'Yes'
}

interface IConfirmModalState extends IConfirmModalProps {
}

export default class ConfirmModal extends React.Component<IConfirmModalProps, IConfirmModalState> {
    constructor(props: IConfirmModalProps & IConfirmModalDefaultProps, context: IConfirmModalState) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = { ...props };
    }

    public open = (confirmationHandler: () => void, cancelHandler: () => void = (() => null)) => {
        this.setState({ ...this.state, confirm: confirmationHandler, cancel: cancelHandler });
        this.handleShow();
    }

    componentDidUpdate = (previousProps: IConfirmModalProps) => {
        if (this.props.show !== previousProps.show) {
            this.setState({ ...this.state, show: !!this.props.show })
        }
    }

    public confirm = () => {
        this.handleClose();
        this.state.confirm();
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
                        <Modal.Title>{this.state.titleText}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>{this.state.mainText}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            {this.state.cancelButtonName}
                        </Button>
                        <Button variant="primary" onClick={this.confirm}>
                            {this.state.confirmButtonName}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}