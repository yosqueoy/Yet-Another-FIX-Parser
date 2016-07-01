import _ from "lodash";
import FixParser from "./FixParser";
import FixFormatter from "./FixFormatter";

function processInput() {
    const in_elm = document.getElementById("in");
    const out_elm = document.getElementById("out");
    const append_to_out = s => { out_elm.innerHTML += `${s}<br>`; };
    out_elm.innerHTML = "";
    fetch('res/FIX.json')
        .then(res => {
            return res.json();
        })
        .then(dic => {
            const parsed_messages = new FixParser(dic).parseFixMsg(in_elm.value);
            const formatted = _.map(parsed_messages, m => {
                return new FixFormatter(m).formatMessage();
            });
            _.forEach(formatted, x => {
                append_to_out(x.header);
                x.prefix && append_to_out(`Prefix: ${x.prefix}`);
                _.forEach(x.formatted_fields, f => append_to_out(`  ${f}`));
                out_elm.innerHTML += '<br>';
            });
            out_elm.classList.toggle("hidden", out_elm.innerHTML.length === 0);
        });
}

window.onload = () => {
    document.getElementById("in").oninput = processInput;
};
