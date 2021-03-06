import React from 'react'
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { postLoginRequest } from '../../actions/userAction';
import TextField from '../Field/TextField';
import Button from '../Button/Button';
import Label from '../Label/Label';
import { Checkbox } from 'semantic-ui-react';
import "./Modal.scss";
class LoginModal extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
    } 

    handleLogin = async (event) => {
        
        event.preventDefault();
        await this.props.postLogin(this.state.email, this.state.password);

        this.props.onClose();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <>
                 <Modal open={this.props.isOpen} center={true} classNames={{ modal: { 'login-form': 'none' } }} showCloseIcon={true} onClose={this.props.onClose}>
                <div className="container-fluid">
                <form>
                    <div className="row" style={{paddingBottom: 35}}>
                        <Label title="Log In" className="login-label"/>
                    </div>
                    <div className="row">
                        <TextField title='E-MAIL' classNameInput="input-field" classNameLabel="title-label" placeholder='Enter your email' name="email" value={this.state.email} onChange={e => this.handleChange(e)}/>
                    </div>
                    <div className="row">
                        <TextField title='PASSWORD' classNameInput="input-field pass" classNameLabel="title-label"  placeholder='Enter your password' name="password" value={this.state.password} onChange={e => this.handleChange(e)}/>
                    </div>
                    <div className="row" style={{paddingTop: 20}}>
                        <Button type="submit" className="bttn-login-sub" title="Login" onButtonClick={e => this.handleLogin(e)} />
                    </div>
                </form>
                <div className="line" style={{marginTop: 50}}></div>
                <div className="row" style={{textAlign: 'center', display: 'block'}}>
                    <Label title="Don’t have an account?" className='default'></Label>
                    <Button title='Register' className='register'/>
                </div>
                </div>
            </Modal>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        postLogin: (email, password) => {
            dispatch(postLoginRequest(email, password));
        }
    }
}

export default connect(null, mapDispatchToProps)(LoginModal);