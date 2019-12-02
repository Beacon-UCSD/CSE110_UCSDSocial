import React, { Component } from 'react';

class Error404 extends Component {
    render() {
        return (
        <div>
            <div className='row'>
                <div className='col-12'>
                    <h1>Error 404</h1>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <p>Page not found.</p>
                </div>
            </div>
        </div>
        );
    }
}

export default Error404;
