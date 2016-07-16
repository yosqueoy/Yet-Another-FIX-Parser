import React from 'react';

export default class AlertPanel extends React.Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired
    }

    render() {
        return (
            <div className='alert alert-danger'>
                {this.props.text}
            </div>);
    }
}