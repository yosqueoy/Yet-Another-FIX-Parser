import React from "react";
import InputView from "./InputView";
import OutputView from "./OutputView";

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "", 
            outputVm: ""
        };
    }

    handleInput(input) {
        const outputVm = `TEST: ${input}`;
        this.setState({
            input: input,
            outputVm: outputVm
        });
    }

    render() {
        return (
            <div>
                <InputView input={this.state.input} onInput={e => this.handleInput(e)} />
                <OutputView outputVm={this.state.outputVm} />
            </div>
        );
    }
}
