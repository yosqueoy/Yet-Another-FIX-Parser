import _ from "lodash";

export default class FixFormatter {
    constructor(message) {
        this._message = message;
    }

    formatMessage() {
        const message = this._message;
        const pad_len = this._getPadLen(message.fields);
        return {
            formatted_fields: _(message.fields).map(f => this._formatField(f, pad_len)).value(),
            header: this._formatHeaderLine(),
            prefix: message.prefix
        };
    }

    _getPadLen(fields) {
        return _(fields).map(f => this._formatTagText(f).length).max();
    }

    _formatHeaderLine() {
        const msg_type = this._findTagValue("MsgType");
        const target = this._findTagValue("TargetCompID");
        const sender = this._findTagValue("SenderCompID");
        const sending_time = this._findTagValue("SendingTime");
        return `[${msg_type}] ${sender} -> ${target} at ${sending_time}`;
    }

    _findTagValue(tag_name) {
        const fields = this._message.fields;
        const found = _.find(fields, f => f.tag_name == tag_name);
        return found ? found.value || found.value_raw : "unknown";
    }

    _formatField(field, pad_len) {
        let tag_text = this._formatTagText(field);
        tag_text = _.padEnd(tag_text, pad_len);
        const value_text = this._formatValueText(field);
        return `${tag_text}: ${value_text}`;
    }

    _formatTagText(field) {
        return field.tag_name ? `${field.tag_name}(${field.tag})` : field.tag;
    }

    _formatValueText(field) {
        return field.value ? `${field.value}(${field.value_raw})` : field.value_raw;
    }
}
