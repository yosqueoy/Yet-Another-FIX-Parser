import React from "react";

export default class InputView extends React.Component {
    static propTypes = {
        input: React.PropTypes.string.isRequired,
        onInput: React.PropTypes.func.isRequired
    }

    handleInput() {
        this.props.onInput(this.refs.input.value);
    }

    render() {
        return <textarea
            value={this.props.input}
            ref="input"
            onInput={e => this.handleInput(e) }
            placeholder="Input FIX log here."
            className="form-control"
            rows="10"></textarea>
    }
}
