import _ from "lodash";

export default class FixParser {
  constructor(dic) {
    this._dic = dic;
  }
  
  parseFixMsg(text) {
    // regex grouping
    // 1: prefix, 2: MsgType, 3. delimiter, 4. FIX body, 5. checksum
    const re = /(.*)(35=.)(.|\^A)(.*)\3(10=\d\d\d)\3/;
    const re_g = /(.*)(35=.)(.|\^A)(.*)\3(10=\d\d\d)\3/g;
    let lines = this._normalizeNewLines(text);
    return _(lines.match(re_g))
      .map(x => x.match(re))
      .map(x => {
        const fields = _.concat(x[2], x[4].split(x[3]));
        return {
          raw: x[0],
          prefix: x[1],
          fields: this._mapFields(fields)
        }
      }).value();
  }  
    
  _mapFields(tag_list) {
    return _(tag_list)
      .map(this._splitTagAndValue)
      .map(this._translate.bind(this))
      .value();
  }

  _splitTagAndValue(s) {
      const idx = s.indexOf('=');
      return [s.substring(0, idx), s.substring(idx + 1)];
  }

  _translate(tag_value_pair) {
    const tag = tag_value_pair[0];
    const value = tag_value_pair[1];
    return {
      tag_name: tag in this._dic ? this._dic[tag].name : undefined,
      tag: tag,
      value: tag in this._dic && this._dic[tag].values && value in this._dic[tag].values ?
        this._dic[tag].values[value].description
        : value
    };
  }

  _normalizeNewLines(text) {
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
}