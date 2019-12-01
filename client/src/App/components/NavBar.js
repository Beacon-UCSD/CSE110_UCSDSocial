import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import auth from '../auth.js';

import logo from '../assets/images/small-logo-with-shadow.png';

import './NavBar.css';

class NavBar extends Component {
    constructor(props) {
        super(props);
        // Check if user is logged in.
        this.userLoggedIn = auth.isAuthenticated();
        if (!this.userLoggedIn) {
            return;
        }
        // Get user info.
        var userInfo = auth.getUserInfo();
        this.userName = userInfo.name;
        this.userImage = userInfo.pictureSrc;
    }

    componentDidMount() {
        // Resize sidebar
        this.handleResize();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        this.refs.sidenav.style.width = this.refs.sidenav.parentElement.offsetWidth + 'px';
    }

    logout() {
        auth.logout((() => {
            this.props.history.push('/login');
        }).bind(this));
    }

    render() {
        if (!this.userLoggedIn) {
            return <div></div>;
        }

        return (
            <div className='sidenav' ref='sidenav'>
                <nav>
                    <div className='sidenav-head'>
                        <Link to='/app/Profile'>
                            <img className='sidenav-profile-img'
                                src={this.userImage} alt={this.userName} />
                            <span className='sidenav-profile-name'>
                                {this.userName}
                            </span>
                        </Link>
                    </div>
                    <ul className='sidenav-menu navbar-nav'>
                        <li className='nav-item'>
                            <Link to='/app/Eventfeed'>Events</Link>
                        </li>
                    </ul>
                    <div className='sidenav-foot'>
                        <button type='button' onClick={this.logout.bind(this)}>
                            Logout</button>
                        <img className='sidenav-logo' src={logo} alt='UCSD Social' />
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;
