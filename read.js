//https://dev.px4.io/en/log/ulog_file_format.html


const UINT_8 = {name: "uint8_t", byte_size: 1, func: (dv, i) => {return dv.getUint8(i, true)}};
const UINT_16 = {name: "uint16_t", byte_size: 2, func: (dv, i) => {return dv.getUint16(i, true)}};
const UINT_32 = {name: "uint32_t", byte_size: 4, func: (dv, i) => {return dv.getUint32(i, true)}};
const UINT_64 = {name: "uint64_t", byte_size: 8, func: (dv, i) => {return dv.getUint32(i, true)}};

const INT_8 = {name: "int8_t", byte_size: 1, func: (dv, i) => {return dv.getInt8(i, true)}};
const INT_16 = {name: "int16_t", byte_size: 2, func: (dv, i) => {return dv.getInt16(i, true)}};
const INT_32 = {name: "int32_t", byte_size: 4, func: (dv, i) => {return dv.getInt32(i, true)}};
const INT_64 = {name: "int64_t", byte_size: 8, func: (dv, i) => {return dv.getInt32(i, true)}};

const FLOAT = {name: "float", byte_size: 4, func: (dv, i) => {return dv.getFloat32(i, true)}};
const DOUBLE = {name: "double", byte_size: 8, func: (dv, i) => {return dv.getFloat64(i, true)}};
const BOOL = {name: "bool", byte_size: 1, func: (dv, i) => {return dv.getInt8(i, true) == 1}};
const CHAR = {name: "char", byte_size: 1, func: (dv, i) => {return String.fromCharCode(dv.getUint8(i, true))}};

const TYPES = {
    uint8_t: UINT_8,
    uint16_t: UINT_16,
    uint32_t: UINT_32,
    uint64_t: UINT_64,

    int8_t: INT_8,
    int16_t: INT_16,
    int32_t: INT_32,
    int64_t: INT_64,

    float: FLOAT,
    double: DOUBLE,
    bool: BOOL,
    char: CHAR,
}

const MSG_TYPES = {
    "B": [
        {name: "compat_flags", type: UINT_8, length: "8"},
        {name: "incompat_flags", type: UINT_8, length: "8"},
        {name: "appended_offsets", type: UINT_64, length: "3"},
    ],
    "F": [
        {name: "format", type: CHAR, length: "$msg_size"}
    ],
    "I": [
        {name: "key_len", type: UINT_8},
        {name: "key", type: CHAR, length: "$key_len"},
        {name: "value", type: CHAR, length: "$msg_size - $key_len - 1"}
    ],
    "M": [
        {name: "is_continued", type: UINT_8},
        {name: "key_len", type: UINT_8},
        {name: "key", type: CHAR, length: "$key_len"},
        {name: "value", type: CHAR, length: "$msg_size - $key_len - 2"}
    ],
    "P": [
        {name: "key_len", type: UINT_8},
        {name: "key", type: CHAR, length: "$key_len"},
        {name: "value", type: CHAR, length: "$msg_size - $key_len - 1"}
    ],
    "A": [
        {name: "multi_id", type: UINT_8},
        {name: "msg_id", type: UINT_16},
        {name: "message_name", type: CHAR, length: "$msg_size - 3"}
    ],
    "R": [ // Not currently used
        {name: "msg_id", type: UINT_16}
    ],
    "D": [
        {name: "msg_id", type: UINT_16},
        {name: "data", type: UINT_8, length: "$msg_size - 2"}
    ],
    "L": [
        {name: "log_level", type: UINT_8},
        {name: "timestamp", type: UINT_64},
        {name: "message", type: CHAR, length: "$msg_size - 9"}
    ],
    "S": [ // Not currently used
        {name: "sync_magic", type: UINT_8, length: "8"}
    ],
    "O": [
        {name: "duration", type: UINT_16}
    ]
}

const LOG_LEVELS = ["EMERG", "ALERT", "CRIT", "ERR", "WARNING", "NOTICE", "INFO", "DEBUG"];

class Unpacker {

    constructor(binaryDataView, currIndex) {
        this.data = new DataView(binaryDataView);
        this.currIndex = currIndex ? currIndex : 0;
    }

    // takes <num> values of <type> from the data
    take(type, num) {
        let values = [];
        for (let i = 0; i < num; i++) {
            values.push(type.func(this.data, this.currIndex));
            this.currIndex += type.byte_size;
        }
        if (type == CHAR && num > 1) {
            return values.join("");
        }
        return num == 1 ? values[0] : values;
    }

    // returns a dictionary formatted according to struct_type
    unpack(struct_type, locals) {
        
        if (!MSG_TYPES[struct_type]) {
            console.log("Tried reading invalid struct type: ", struct_type);
            return {};
        }

        let struct = MSG_TYPES[struct_type];
        let result_obj = Object.assign({msg_type: struct_type}, locals);

        for (let i = 0; i < struct.length; i++) {
            let member = struct[i];
            let member_length = member.length ? member.length : "1";
            let vars = member_length.match(/(\$\w+)+/g);
            vars = vars ? vars : [];
            
            for (let i = 0; i < vars.length; i++) {
               let variable_name = vars[i].substring(1);
               //console.log(vars[i]);
               //console.log('res',result_obj[variable_name])
               
               //console.log("mem", member_length);
               member_length = member_length.replace(vars[i], result_obj[variable_name]);
            }
            member_length = eval(member_length);
            result_obj[member.name] = this.take(member.type, member_length);
            
        }
        //console.log(result_obj);
        return result_obj;
    }

    empty() {
        return this.currIndex >= this.data.byteLength;
    }
}

function parseInformationMessages(messages) {
    let parsed_info = {};
    for (let i = 0; i < messages.length; i++) {
        let key_name = messages[i].key.split(" ")[1];
        let key_type = messages[i].key.split(" ")[0];
        let valueBinary = new Uint8Array(_.map(messages[i].value, (c) => {return c.charCodeAt(0)}));
        let unpacker = new Unpacker(valueBinary.buffer);
        let n = 1;
        if (key_type[key_type.length - 1] == "]") { //is array type
            n = parseInt(key_type.substring(key_type.indexOf("[") + 1, key_type.indexOf("]")));
            key_type = key_type.substring(0, key_type.indexOf("["));
        }
        parsed_info[key_name] = unpacker.take(TYPES[key_type], n);
    }
    return parsed_info;
}

function parseParameterMessages(messages) {
    return parseInformationMessages(messages); // types are limited in parameters -- but essentially equal to info
}

function parseInformationMultiMessages(messages) {
    let parsed_info = {};
    for (let i = 0; i < messages.length; i++) {
        let key_name = messages[i].key.split(" ")[1];
        let key_type = messages[i].key.split(" ")[0];
        let isContinued = messages[i].is_continued == 1;
        let valueBinary = new Uint8Array(_.map(messages[i].value, (c) => {return c.charCodeAt(0)}));
        let unpacker = new Unpacker(valueBinary.buffer);
        let n = 1;
        if (key_type[key_type.length - 1] == "]") { //is array type
            n = parseInt(key_type.substring(key_type.indexOf("[") + 1, key_type.indexOf("]")));
            key_type = key_type.substring(0, key_type.indexOf("["));
        }
        if (!parsed_info[key_name]) {
            parsed_info[key_name] = [];
        }
        if (isContinued) {
            parsed_info[key_name][parsed_info[key_name].length - 1] += "\n" + unpacker.take(TYPES[key_type], n);
        } else {
            parsed_info[key_name].push(unpacker.take(TYPES[key_type], n));
        }

    }
    return parsed_info;
}

function parseFormatMessages(messages) {
    let parsed_formats = {};
    for (let i = 0; i < messages.length; i++) {
        let name = messages[i].format.substring(0, messages[i].format.indexOf(":"));
        let fields = messages[i].format.substring(messages[i].format.indexOf(":") + 1).split(";");
        parsed_formats[name] = fields;
    }
    return parsed_formats;
}

function parseAddLogMessages(messages) {
    let parsed_data = {};
    for (let i = 0; i < messages.length; i++) {
        let id = messages[i].msg_id;
        let multiId = messages[i].multi_id.toString();
        parsed_data[id] = {name: messages[i].message_name, multiId: multiId};
    }
    return parsed_data;
}

function parseFieldList(unpacker, format, allFormats) {
    let parsedData = {};
    test = 0;
    for (let j = 0; j < format.length; j++) {
        let field_type = format[j].split(" ")[0];
        let field_name = format[j].split(" ")[1];
        if (field_type && field_name && format[j].trim() != "" && !field_name.startsWith("_padding")) {
            let n = 1;
            if (field_type[field_type.length - 1] == "]") { //is array type
                n = parseInt(field_type.substring(field_type.indexOf("[") + 1, field_type.indexOf("]")));
                field_type = field_type.substring(0, field_type.indexOf("["));
                
            }
            if (!TYPES[field_type] && allFormats[field_type]) {
                let sub = parseFieldList(unpacker, allFormats[field_type], allFormats);

                parsedData[field_name] = sub;
                //console.log(field_name, sub)
                test = 1;
            } else {
                parsedData[field_name] = unpacker.take(TYPES[field_type], n);
                if(Array.isArray(parsedData[field_name])){
                    let list = parsedData[field_name];
                    for (let i = 0; i < list.length; i++){
                        parsedData[field_name + '[' + i + ']'] = list[i];
                    }
                }
                
               

            }
        }
        //if(typeof parsedData[field_name] != 'number' && typeof parsedData[field_name] != 'boolean'){
        //    console.log(typeof parsedData[field_name], field_name, parsedData[field_name]);
        //}
        
    }
    //if (test == 1){
    //console.log(parsedData);
    //}
    return parsedData;
}

function parseDataMessages(messages, id_to_msg_name, formats) {
    console.log("parsing data messages")
    //let t0 = performance.now();
    let parsedMessages = {};
    for (let id in id_to_msg_name) {
        let parsedId = id_to_msg_name[id].name; //+ "_" + id_to_msg_name[id].multiId;
        if (!parsedMessages[parsedId]) {
            parsedMessages[parsedId] = [];
        }
        messages_subset = _.filter(messages, (x) => {return x.msg_id == id});
        let format = formats[id_to_msg_name[id].name];
        for (let i = 0; i < messages_subset.length; i++) {
            let data = messages_subset[i].data;
           // console.log(parseFieldList(new Unpacker(new Uint8Array(data).buffer), format, formats));
          // console.log(parsedId);
            parsedMessages[parsedId].push(parseFieldList(new Unpacker(new Uint8Array(data).buffer), format, formats));
        }
    }
    
    //let t1 = performance.now();
    //console.log("Call to parseDataMessages took " + (t1 - t0) + " milliseconds.")

    return parsedMessages;
}

function parseLogMessages(messages) {
    let logData = _.map(messages, (m) => {return _.pick(m, ["message", "log_level", "timestamp"])});
    return _.map(logData, (l) => {
        l.log_level = LOG_LEVELS[l.log_level % 8];
        return l;
    });
}

function parseDropoutMessages(messages) {
    return _.map(messages, (m) => {return m.duration});
}

function readULog(binary, callback) {
    console.log('reading');
    let messages = [];
    let headerUnpacker = new Unpacker(binary.slice(0, 16));
    
    let headerBytes = headerUnpacker.take(UINT_8, 7);
    let ulogVersion = headerUnpacker.take(UINT_8, 1);
    let loggingStartTime = headerUnpacker.take(UINT_64, 1);

    if (!_.isEqual(headerBytes, [0x55,0x4c,0x6f,0x67,0x01,0x12,0x35])) {
        throw "Invalid header bytes: cannot parse the log!";
    }

    let unpacker = new Unpacker(binary.slice(16));

    let appendedDataIndex = unpacker.data.byteLength;
    
    while (!unpacker.empty()) {
        if (unpacker.currIndex >= appendedDataIndex) {
            console.log("DONE READING UNAPPENDED STUFF");
            break;
        }
        let msg_size = unpacker.take(UINT_16, 1);
        let hdr_size = 3;
        let msg_type = unpacker.take(CHAR, 1);
        let locals = {msg_size: msg_size, hdr_size: hdr_size};
        let msg_obj = unpacker.unpack(msg_type, locals);
        if (msg_obj.msg_type == "B") {
            if (msg_obj.incompat_flags.slice(1).some((x) => {return x != 0 })) {
                throw "Unknown incompatible flag set: cannot parse the log!";
            }

            if (msg_obj.incompat_flags[0] == 1) { //there is appended data
                appendedDataIndex = msg_obj.appended_offsets[0] - 16;
            }

        }
        //console.log(msg_obj)
        messages.push(msg_obj);
    }

    
    unpacker.currIndex = appendedDataIndex;
    let appendedMessages = [];
    while (!unpacker.empty()) {
        let msg_size = unpacker.take(UINT_16, 1);
        let hdr_size = 3;
        let msg_type = unpacker.take(CHAR, 1);
        let locals = {msg_size: msg_size, hdr_size: hdr_size};
        let msg_obj = unpacker.unpack(msg_type, locals);
        appendedMessages.push(msg_obj);
    }
    messages = messages.concat(appendedMessages);
    

    console.log("Finished unpacking...");
    // let info = parseInformationMessages(_.filter(messages, (x) => {return x.msg_type == "I"}));
    // let multiInfo = parseInformationMultiMessages(_.filter(messages, (x) => {return x.msg_type == "M"}));
    let formats = parseFormatMessages(_.filter(messages, (x) => {return x.msg_type == "F"}));
    let id_to_msg_name = parseAddLogMessages(_.filter(messages, (x) => {return x.msg_type == "A"}));
    let data = parseDataMessages(_.filter(messages, (x) => {return x.msg_type == "D"}), id_to_msg_name, formats);
    //data = _.mapObject(data, (x) => {
    //    return _.map(x, (y) => {
    //        //y.timestamp -= loggingStartTime;
    //        return y;
     //   });
    //});
    //console.log(data.position_setpoint_triplet);
    newObj = []
    ind = ['current','next','previous'];
    for (let i = 0; i < data.position_setpoint_triplet.length; i++){
        //console.log(data.position_setpoint_triplet[i])
        timestamp = data.position_setpoint_triplet[i]['timestamp']
        row = {}
        for (let j = 0; j < ind.length; j++){
            row['timestamp'] = timestamp;
            keys = Object.keys(data.position_setpoint_triplet[i][ind[j]]);
            for (let k = 0; k < keys.length; k++){
                row[ind[j] + '.' + keys[k]] = data.position_setpoint_triplet[i][ind[j]][keys[k]]
            }
        }
        newObj.push(row);
    }
    data['position_setpoint_triplet'] = newObj;

    data = JSON.stringify(data);
    data = JSON.parse(data.replace(/\bNaN\b/g, "null"));

    //console.log(data);
    // let logs = parseLogMessages(_.filter(messages, (x) => {return x.msg_type == "L"}));
    // let dropouts = parseDropoutMessages(_.filter(messages, (x) => {return x.msg_type == "O"}));
    // let parameters = parseParameterMessages(_.filter(messages, (x) => {return x.msg_type == "P"}));

    callback({
        // fileFormatVersion: ulogVersion,
        // loggingStartTime: loggingStartTime,
        // info: info,
        // multiInfo: multiInfo,
        // logs: logs,
        data: data,
        // dropouts: dropouts,
        // parameters: parameters
    });
}

