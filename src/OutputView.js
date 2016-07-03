import React from "react";
import _ from "lodash";
import FixParser from "./FixParser";
import FixFormatter from "./FixFormatter";

export default class OutputView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { output: "" };
    }

    componentWillReceiveProps(nextProps) {
        console.log(`componentWillReceiveProps`);
        this._processInput(nextProps.outputVm).then(out => {
            this.setState({ output: out });
        });
    }

    render() {
        const style = `output ${this.state.output.length === 0 ? "hidden" : ""}`;
        return <pre
            className={style}
            dangerouslySetInnerHTML={this._createMarkup(this.state.output) } />;
    }

    _createMarkup(s) {
        return { __html: s };
    }

    _processInput(input) {
        return fetch('res/FIX.json')
            .then(res => {
                return res.json();
            })
            .then(dic => {
                let out = "";
                const append_to_out = s => { out += `${s}<br>`; };
                const parsed_messages = new FixParser(dic).parseFixMsg(input);
                const formatted = _.map(parsed_messages, m => {
                    return new FixFormatter(m).formatMessage();
                });
                _.forEach(formatted, x => {
                    append_to_out(x.header);
                    x.prefix && append_to_out(`Prefix: ${x.prefix}`);
                    _.forEach(x.formatted_fields, f => append_to_out(`  ${f}`));
                    out += '<br>';
                });
                return out;
            });
    }

}
