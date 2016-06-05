'use strict';

function mapFields(tag_list, dic) {
  return _(tag_list)
    .map(x => x.split('=', 2))
    .map(x => translate(x, dic))
    .value();
}

function translate(tag_value_pair, dic) {
  const tag = tag_value_pair[0];
  const value = tag_value_pair[1];
  return {
    tag_name: tag in dic ? dic[tag].name : undefined,
    tag: tag,
    value: tag in dic && dic[tag].values && value in dic[tag].values ?
      dic[tag].values[value].description
      : value
  };
}

function normalizeNewLines(text) {
  const s = text.replace('\r', '');
  const endsWithCheckSum = msg => msg.search(/10=\d\d\d.?\s*$/) !== -1;
  return _(s)
    .reduce((result, c) => {
      if (c !== '\n' || endsWithCheckSum(result)) {
        return result + c
      } else {
        return result;
      }
    }, "");
}

function parseFixMsg(text, dic) {
  // regex grouping
  // 1: prefix, 2: FIX version tag, 3. delimiter, 4. FIX body, 5. checksum
  const re = /(.*)(8=FIX\.4\.\d)(.|\^A)(.*)\3(10=\d\d\d)\3/;
  const re_g = /(.*)(8=FIX\.4\.\d)(.|\^A)(.*)\3(10=\d\d\d)\3/g;
  let lines = normalizeNewLines(text);
  return _(lines.match(re_g))
    .map(x => x.match(re))
    .map(x => {
      const fields = x[4].split(x[3]);
      return {
        raw: x[0],
        prefix: x[1],
        fields: mapFields(fields, dic)
      }
    }).value();
}

function formatHeaderLine(message) {
  const msg_type = findValue(message.fields, "MsgType");
  const target = findValue(message.fields, "TargetCompID");
  const sender = findValue(message.fields, "SenderCompID");
  const sending_time = findValue(message.fields, "SendingTime");
  return `[${msg_type}] ${sender} -> ${target} at ${sending_time}`;
}

function findValue(fields, tag_name) {
  const found = _.find(fields, f => f.tag_name == tag_name);
  return found ? found.value : "unknown";
}

function formatField(field) {
  const pad_length = 25;
  let tag_text = field.tag_name ? `${field.tag_name}(${field.tag})` : field.tag;
  tag_text = _.padEnd(tag_text, pad_length);
  return `${tag_text}: ${field.value}`;
}

function formatMessage(message) {
  const formatted_fields = _(message.fields).map(formatField).value();
  return {
    formatted_fields: formatted_fields,
    header: formatHeaderLine(message),
    prefix: message.prefix
  };
}

function processInput() {
  const in_elm = document.getElementById("in");
  const out_elm = document.getElementById("out");
  const append_to_out = s => { out_elm.innerHTML += `${s}<br>`; };
  out_elm.innerHTML = "";
  fetch('js/FIX.json')
    .then(res => {
      return res.json();
    }).then(dic => {
      const parsed_messages = parseFixMsg(in_elm.value, dic);
      const formatted = _.map(parsed_messages, formatMessage);
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