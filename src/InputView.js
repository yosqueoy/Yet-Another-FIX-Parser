import React from "react";

export default class InputView extends React.Component {
    static propTypes = {
        fixText: React.PropTypes.string.isRequired,
        showHeader: React.PropTypes.bool.isRequired,
        onInput: React.PropTypes.func.isRequired
    }

    handleInput() {
        this.props.onInput({
            fixText: this.refs.fixText.value, 
            showHeader: this.refs.showHeader.checked
        });
    }

    render() {
        return (
            <div>
                <textarea
                    value={this.props.fixText}
                    ref="fixText"
                    onInput={e => this.handleInput(e) }
                    placeholder="Input FIX log here."
                    className="form-control"
                    rows="10">
                </textarea>
                <div className="checkbox">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={this.props.showHeader} 
                            ref="showHeader"
                            onChange={e => this.handleInput(e)}/>
                        Show header/footer/seqnum
                    </label>
                </div>
            </div>
        );
    }
}
