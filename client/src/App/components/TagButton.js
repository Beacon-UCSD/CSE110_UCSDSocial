import React, { Component } from 'react';

const tagDivStyle = {
    display: 'inline-block',
    width: 'min-content',
    margin: '5px',
    backgroundColor: '#e5e5e5',
    borderRadius: '16px',
    border: '1px solid #a5a5a5',
    fontFamily: 'arial, sans-serif',
    fontSize: '16px',
};

const tagDeleteBtnStyle = {
    all: 'unset',
    width: '18px',
    height: '18px',
    backgroundColor: '#e5e5e5',
    borderRadius: '50%',
    border: '1px solid #c1c1c1',
    marginRight: '1px',
    fontSize: '14px',
    textDecoration: 'none',
    textAlign: 'center',
    lineHeight: '7px',
    color: '#a5a5a5',
    position: 'relative',
    top: '-1px',
    left: '-6px',
    cursor: 'pointer'
};

const tagTextStyle = {
    color: '#5a5a5a',
    position: 'relative',
    top: '-1px'
};

class TagButton extends Component {
    componentDidMount() {
        // Calcaulate and set tag width so that it all appears on one line
        var tagWidth = this.refs.tagDeleteBtn.offsetWidth +
            this.refs.tagText.offsetWidth;
        this.refs.tagDiv.style.width = (tagWidth+16) + 'px';
    }

    render() {
        return (
            <div style={tagDivStyle} ref='tagDiv'>
                <button type='button' style={tagDeleteBtnStyle} onClick={this.props.deleteHandler} ref='tagDeleteBtn'>X</button>
                <span style={tagTextStyle} ref='tagText'>{this.props.tag}</span>
            </div>
        );
    }
}

export default TagButton;
