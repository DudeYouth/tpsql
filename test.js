'use strict';
let mysql = require('mysql');
let moment = require('moment');
moment.locale('zh-cn');
let fs = require("fs");
let dbConfig = {}
try {
    dbConfig = fs.readFileSync('conf/db.json', 'utf-8');
    dbConfig = JSON.parse(dbConfig);
} catch (err) {
    console.log(err);
    fs.appendFile('logs/' + moment().format('L') + '-mysql.txt', 'ERROR: ' + err + '\n', () => {});
}
let pool = mysql.createPool(dbConfig);
let connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, data) => {
            if (error) reject(error);
            resolve(data);
        });
    });

};
let execSql = (conn, sql) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, (error, data) => {
            //释放连接  
            conn.release();
            //事件驱动回调  
            if (error) reject(error);
            resolve(data);

        });
    })
}
async function query(sql) {
    let conn = await connection();
    let result = execSql(conn, sql);
    return result;
}

class Model {
    constructor() {
        this.name = this.constructor.name;
        if (this.name.indexOf('Model') == -1) {
            console.error('name模型命名不规范');
        }
        this.config = dbConfig;
        this.config.prefix = (this.config.prefix || '');
        this.init();

    }
    init() {
        let tablename = this.name !== 'Model' ? this.name.substring(0, this.name.indexOf('Model')).toLowerCase() : '';
        this.csql = '';
        this.tablename = this.addPrefix(tablename);;
        this.fieldName = ' * ';
    }
    add(data) {
        this.csql = 'insert into ' + this.tablename + ' set ' + createData(data);
        this.query(this.csql)
    }
    update() {
        this.csql = 'update ' + this.tablename + ' set ' + createData(data);
        return this.query(this.csql);
    }
    delete(data) {
        this.csql = 'delete from ' + this.tablename + this.csql;
        return this.query(this.csql);
    }
    addPrefix(tablename) {
        return (this.config.prefix + tablename);
    }
    table(data) {
        this.tablename = this.addPrefix(data);
        return this;
    }
    join(data) {
        this.csql += ' inner join' + this.addPrefix(data);
        return this;
    }
    leftJoin(data) {
        this.csql += ' left join' + this.addPrefix(data);
        return this;
    }
    rightJoin(data) {
        this.csql += ' right join' + this.addPrefix(data);
        return this;
    }
    where(data) {
        if (isString(data)) {
            this.csql += ' where ' + data + ' ';
        } else if (isObject(data)) {
            this.csql += ' where ' + createWhere(data) + ' ';
        }
        return this;
    }
    group(data) {
        this.csql += ' group by' + data;
        return this;
    }
    having(data) {
        this.csql += ' having ' + data;
        return this;
    }
    limit(data) {
        this.csql += ' limit ' + data;
        return this;
    }
    order(data) {
        this.csql += ' order by ' + data;
        return this;
    }
    field(data) {
        this.fieldName = data;
        return this;
    }
    query(sql) {
        this.sql = sql;
        fs.appendFile('logs/' + moment().format('L') + '-mysql.txt', 'SQL: ' + sql + '\n', () => {});
        this.init();
        return query(sql);
    }
    select(flag) {
        let sql = 'select ' + this.fieldName + ' from ' + this.tablename + this.csql;
        if (flag === true) {
            return sql;
        } else {
            return this.query(sql);
        }
    }
    async find() {
        let sql = this.select(true);
        let result = await this.query(sql);
        if (result && result.length > 0) {
            return result[0];
        } else {
            return false;
        }
    }
    async getField(field, flag = false) {
        let sql = this.select(true);
        let arr = [];
        let result = await this.query(sql);
        if (result && result.length > 0) {
            if (!result[0][field]) {
                console.error(field + '字段不存在！');
                return false;
            } else if (flag === true) {
                result.forEach((value) => {
                    arr.push(value[field]);
                })
                return arr;
            } else if (!flag) {
                return result[0][field];
            }

        } else {
            return false;
        }
    }
}

function isNumber(data) {
    return (typeof data == 'number') && data.constructor == Number;
}

function isString(data) {
    return (typeof data == 'string') && data.constructor == String;
}

function isArray(data) {
    return (data instanceof Array);
}

function isObject(data) {
    return (Object.prototype.toString.call(data) === '[object Object]');
}

// 创建数据（数据插入或者数据更新）
function createData(data) {
    let arr = [];
    foreach(data, (value, key) => {
        if (isNumber(value) || isString(value)) {
            arr.push(key + '=' + escape(value));
        } else if (isObject(value)) {

        }
    })
    return arr.join(',');
}

// 创建where条件
function createWhere(data) {
    let arr = [];
    foreach(data, (value, key) => {
        let cache = {};
        cache[key] = data;
        let str = '';
        let len = arr.length - 1;
        str = expfun(cache);
        if (str) {
            if (key === 'or') {
                arr[len] = arr[len] + str;
            } else {

            }
        } else if (key === 'exp') { // csql表达式
            arr[len] += value;
        } else if (key === 'or') { // or表达式
            if (isString(value)) {
                arr[len] += ' or ' + value;
            } else if (isObject(value)) {
                arr[len] += ' or ' + createWhere(value);
            }
        } else if (isObject(value)) {
            arr.push(key + expfun(value));
        } else if (isString(value) || isNumber(value)) {
            arr.push(key + '=' + escape(value));
        }
    })
    return arr.join(' and ');
}
// 条件表达式
function expfun(data) {
    let keys = Object.keys(data);
    let key = keys[0];
    let value = data[key];
    let returnValue = '';
    switch (key) {
        case 'in':
            if (isArray(value)) {
                returnValue = ' in (' + value.join(',') + ')';
            } else if (isString(value)) {
                returnValue = ' in (' + value + ')';
            }
            break;
        case 'lt':
            returnValue = ' < ' + escape(value);
            break;
        case 'gt':
            returnValue = ' > ' + escape(value);
            break;
        case 'egt':
            returnValue = ' >= ' + escape(value);
            break;
        case 'elt':
            returnValue = ' <= ' + escape(value);
            break;
    }
    return returnValue;
}

function escape(value) {
    return pool.escape(value);
}

// 遍历方法
function foreach(data, callback) {
    var keys = Object.keys(data);
    keys.forEach((key) => {
        callback && callback(data[key], key);
    })
}

class UsersModel extends Model {
    getMsg() {
        return this.field('id,mid,gid').where({ id: { 'in': [80, 81] } }).select();
    }
}
let user = new UsersModel();
async function test() {
    let result = await user.getMsg();
    console.log(result, user.sql);
}
test();