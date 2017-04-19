import React from "react";
import InputView from "./InputView";
import OutputView from "./OutputView";

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outputVm: {fixText: "", showHeader:false} 
        };
    }

    handleInput(e) {
        this.setState({
            outputVm: {fixText: e.fixText, showHeader: e.showHeader}
        });
    }

    render() {
        return (
            <div>
                <InputView fixText={this.state.outputVm.fixText} showHeader={this.state.outputVm.showHeader} onInput={e => this.handleInput(e)} />
                <OutputView outputVm={this.state.outputVm} />
            </div>
        );
    }
}
