import _ from "lodash";
import FixField from "./FixField";
import FixMessage from "./FixMessage";

export default class FixParser {
    constructor(dic) {
        this._dic = dic;
    }

    parseFixMsg(text, filter_list) {
        // regex grouping
        // 1: prefix, 2: BeginString or MsgType, 3. delimiter, 4. FIX body, 5. checksum, 6. suffix
        const re = /(.*?)(8=FIX.{4}|35=.)(.|\^A)(.*)\3(10=\d\d\d)(.*)/;
        const re_g = new RegExp(re, "g");
        let lines = this._normalizeNewLines(text);
        return _(lines.match(re_g))
            .map(x => x.match(re))
            .map(matches => {
                const [raw, prefix, head, delim, body, checksum, suffix] = matches;
                const pair_strs = _.concat(head, this._splitBody(body, delim), checksum);
                const fields = this._mapToFields(pair_strs, filter_list);
                return new FixMessage(raw, prefix, fields);
            }).value();
    }

    _splitBody(body, delim) {
        const pair_strs = body.split(delim);
        return _(pair_strs).reduce((folded, s) => {
            if (s.includes("=")) 
                folded.push(s);
            else 
                folded[folded.length - 1] += delim + s;
            return folded;
        }, []);
    }

    _mapToFields(pair_strs, filter_list) {
        return _(pair_strs)
            .map(this._splitTagValue)
            .map(this._translate.bind(this))
            .filter(x => !_.includes(filter_list, x.tag))
            .value();
    }

    _splitTagValue(s) {
        const idx = s.indexOf('=');
        return [s.substring(0, idx), s.substring(idx + 1)];
    }

    _translate(tag_value_pair) {
        const [tag, value_raw] = tag_value_pair;
        const is_in_dic = tag in this._dic;
        const value_map = is_in_dic ? this._dic[tag].values : undefined;
        const tag_name = is_in_dic ? this._dic[tag].name : undefined;
        const value = 
            is_in_dic && value_map && value_raw in value_map ?
                value_map[value_raw].description
                : undefined;
        return new FixField(tag_name, tag, value, value_raw);
    }

    _normalizeNewLines(text) {
        const s = text.replace('\r', '');
        const endsWithCheckSum = msg => msg.search(/10=\d\d\d(.?|\^A)\s*$/) !== -1;
        return _(s)
            .reduce((result, c) => 
                c !== '\n' || endsWithCheckSum(result) ? result + c : result
            , "");
    }
}
