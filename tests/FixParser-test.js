jest.unmock("../src/FixParser");
jest.unmock("lodash");

import FixParser from '../src/FixParser';
import dic from "../res/FIX.json";

describe("FixParser", () => {
    it("parses a simple message", () => {
        const message = `8=FIX.4.1|9=154|35=6|49=BRKR|56=INVMGR|34=236|52=19980604-07:58:48|23=115685|28=N|55=SPMI.MI|54=2|27=200000|44=10100.000000|25=H|10=159|`;
        const expected = [{ "raw": "8=FIX.4.1|9=154|35=6|49=BRKR|56=INVMGR|34=236|52=19980604-07:58:48|23=115685|28=N|55=SPMI.MI|54=2|27=200000|44=10100.000000|25=H|10=159|", "prefix": "8=FIX.4.1|9=154|", "fields": [{ "tag_name": "MsgType", "tag": "35", "value": "INDICATION_OF_INTEREST" }, { "tag_name": "SenderCompID", "tag": "49", "value": "BRKR" }, { "tag_name": "TargetCompID", "tag": "56", "value": "INVMGR" }, { "tag_name": "MsgSeqNum", "tag": "34", "value": "236" }, { "tag_name": "SendingTime", "tag": "52", "value": "19980604-07:58:48" }, { "tag_name": "IOIID", "tag": "23", "value": "115685" }, { "tag_name": "IOITransType", "tag": "28", "value": "NEW" }, { "tag_name": "Symbol", "tag": "55", "value": "SPMI.MI" }, { "tag_name": "Side", "tag": "54", "value": "SELL" }, { "tag_name": "IOIQty", "tag": "27", "value": "200000" }, { "tag_name": "Price", "tag": "44", "value": "10100.000000" }, { "tag_name": "IOIQltyInd", "tag": "25", "value": "HIGH" }] }];
        const parser = new FixParser(dic);
        const result = parser.parseFixMsg(message);
        expect(result).toEqual(expected);
    });
    it("parses multiple messages", () => {
        const message = `8=FIX.4.1|9=112|35=0|49=BRKR|56=INVMGR|34=235|52=19980604-07:58:28|112=19980604-07:58:28|10=157|
8=FIX.4.1|9=90|35=0|49=INVMGR|56=BRKR|34=236|52=19980604-07:59:30|10=225|
        `;
        const expected = [{ "raw": "8=FIX.4.1|9=112|35=0|49=BRKR|56=INVMGR|34=235|52=19980604-07:58:28|112=19980604-07:58:28|10=157|", "prefix": "8=FIX.4.1|9=112|", "fields": [{ "tag_name": "MsgType", "tag": "35", "value": "HEARTBEAT" }, { "tag_name": "SenderCompID", "tag": "49", "value": "BRKR" }, { "tag_name": "TargetCompID", "tag": "56", "value": "INVMGR" }, { "tag_name": "MsgSeqNum", "tag": "34", "value": "235" }, { "tag_name": "SendingTime", "tag": "52", "value": "19980604-07:58:28" }, { "tag_name": "TestReqID", "tag": "112", "value": "19980604-07:58:28" }] }, { "raw": "8=FIX.4.1|9=90|35=0|49=INVMGR|56=BRKR|34=236|52=19980604-07:59:30|10=225|", "prefix": "8=FIX.4.1|9=90|", "fields": [{ "tag_name": "MsgType", "tag": "35", "value": "HEARTBEAT" }, { "tag_name": "SenderCompID", "tag": "49", "value": "INVMGR" }, { "tag_name": "TargetCompID", "tag": "56", "value": "BRKR" }, { "tag_name": "MsgSeqNum", "tag": "34", "value": "236" }, { "tag_name": "SendingTime", "tag": "52", "value": "19980604-07:59:30" }] }];
        const parser = new FixParser(dic);
        const result = parser.parseFixMsg(message);
        expect(result).toEqual(expected);
    })
    it("parses a message with semicolon separaters", () => {
        const message = `8=FIX.4.4;9=61;35=A;49=BRKR;56=INVMGR;98=0;34=1;52=20000426-12:05:08;108=30;10=143;`;
        const expected = [{ "raw": "8=FIX.4.4;9=61;35=A;49=BRKR;56=INVMGR;98=0;34=1;52=20000426-12:05:08;108=30;10=143;", "prefix": "8=FIX.4.4;9=61;", "fields": [{ "tag_name": "MsgType", "tag": "35", "value": "LOGON" }, { "tag_name": "SenderCompID", "tag": "49", "value": "BRKR" }, { "tag_name": "TargetCompID", "tag": "56", "value": "INVMGR" }, { "tag_name": "EncryptMethod", "tag": "98", "value": "NONE" }, { "tag_name": "MsgSeqNum", "tag": "34", "value": "1" }, { "tag_name": "SendingTime", "tag": "52", "value": "20000426-12:05:08" }, { "tag_name": "HeartBtInt", "tag": "108", "value": "30" }] }];
        const parser = new FixParser(dic);
        const result = parser.parseFixMsg(message);
        expect(result).toEqual(expected);
    });
});
