import _ from "lodash";

export default class FixFormatter {
  constructor(message){
    this._message = message;
  }

  formatMessage() {
    const message = this._message;
    return {
      formatted_fields: _(message.fields).map(this._formatField).value(),
      header: this._formatHeaderLine(),
      prefix: message.prefix
    };
  }

  _formatHeaderLine() {
    const msg_type =this._findTagValue("MsgType");
    const target =this._findTagValue("TargetCompID");
    const sender =this._findTagValue("SenderCompID");
    const sending_time =this._findTagValue("SendingTime");
    return `[${msg_type}] ${sender} -> ${target} at ${sending_time}`;
  }

  _findTagValue(tag_name) {
    const fields = this._message.fields;
    const found = _.find(fields, f => f.tag_name == tag_name);
    return found ? found.value : "unknown";
  }

  _formatField(field) {
    const pad_length = 25;
    let tag_text = field.tag_name ? `${field.tag_name}(${field.tag})` : field.tag;
    tag_text = _.padEnd(tag_text, pad_length);
    return `${tag_text}: ${field.value}`;
  }
}