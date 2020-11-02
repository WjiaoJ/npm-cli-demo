/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var app_test = __webpack_require__(2).app_test;

var _require = __webpack_require__(3),
    Sht20 = _require.Sht20;

var _require2 = __webpack_require__(4),
    I2cMaster = _require2.I2cMaster,
    I2cDev = _require2.I2cDev;

var Adc = __webpack_require__(5).Adc;

function uartChipTest() {
    console.log('in uart chip test');
    var i2cHandler = i2cInit(1, 23, 22, 400000);
    var writeData = Buffer.from([0x16], 'hex');
    console.log('write data:', writeData);
    i2cWrite(i2cHandler, 0x35, 0x30, Uint8Array.plainOf(writeData), 1000);
    console.log(i2cRead(i2cHandler, 0x35, 0x30, 1, 1000));
}

var i2c2 = new I2cMaster(0, { sdaPin: 18, sclPin: 5, freq: 400000 });
var i2c1 = new I2cMaster(1, { sdaPin: 23, sclPin: 22, freq: 400000 });

function rtcTest() {
    var rtc = new I2cDev(i2c2.getInstace(), 0x68);

    rtc.writeByteSync(7, 0x80);
    rtc.writeByteSync(0, 0);
    rtc.writeByteSync(1, 0x80);

    setInterval(function () {
        console.log('rtc 0:', rtc.readByteSync(0));
    }, 1500);
}

function tempHumidTest() {
    var tempHumid = new Sht20(new I2cDev(i2c2.getInstace(), 0x40));
    tempHumid.getTemp().then(function (value) {
        console.log('temp value', value);
        tempHumid.getRelHumid().then(function (value) {
            console.log('Humid value', value);
        });
    });
}

function adcChipTest() {

    var lsm = new I2cDev(i2c2.getInstace(), 0x6b);
    var dev = new I2cDev(i2c1.getInstace(), 0x1D);

    pinMode(4, OUTPUT);
    digitalWrite(4, HIGH);

    var adc = new Adc(dev);

    console.log('adc info:', adc.readChipInfo());
    adc.init();
    function adcIterRead(id) {
        if (id > 8) {
            return;
        }
        console.log('before read one shot');
        adc.readChanOneShot(id).then(function (value) {
            console.log('chanId: ' + i + ' value: ' + value);
            //adcIterRead(id + 1);
        }).catch(function (err) {
            console.log('fail to resove when readChanOneShot', err);
        });
    }

    //setInterval(() => {
    adcIterRead(0);
    //adc.readChanOneShot(0).then((value) => {
    //    console.log(`chanId: 0  value: ${value}`);
    //})
    //}, 10000);
}
function initBoardPinmux() {
    Uart.setUartPinmux([{ id: 1, tx: 4, rx: 2 }, { id: 2, tx: 32, rx: 35 }]);
}

setInterval(function () {
    console.log('hello ruff');
}, 20000);

function nbTest() {
    var nbConfig = {
        cmConf: {
            host: '183.230.40.40',
            port: 5683,
            lifetime: 86400,
            regTimeout: 60,
            attachWaitTimes: 20
        },
        cuConf: {
            host: '119.3.250.80',
            port: 5683,
            attachWaitTimes: 40
        },
        ctConf: {
            host: '117.60.157.137',
            port: 5683,
            attachWaitTimes: 20
        }
    };

    //uartOptions.uartId, uartOptions.baudRate, uartOptions.config, uartOptions.queueLen, uartOptions.inverted);
    var nbUartConfig = {
        pwrPin: 15,
        uart: {
            uartId: 2,
            baudRate: 9600,
            config: RUFF_UART.SERIAL_8N1,
            queueLen: 64,
            inverted: false
        }
    };
    var nbClient = new NbClient.NbClient(nbUartConfig, nbConfig);

    nbClient.init();
}

function gen_os_ota_worker(num) {
    var maxTry = num;
    var tryNum = 0;
    function do_os_ota(url) {
        console.log('Before do OS OTA');

        var ret = RUFF_OTA.el_ruff_update_os('http://68.79.31.165:10025/ota.image');
        if (ret !== 0) {
            tryNum += 1;
            if (tryNum >= maxTry) {
                console.log('give up ota for max try number matched');
            }
            setTimeout(do_os_ota, 3000);
        }
    }
    return do_os_ota;
}

function cmux_and_pppos_test() {
    var cmux_id = RUFF_CMUX.el_ruff_cmux_init();
    console.log('in cmux_and_pppos_test cmux_id:', cmux_id);
    RUFF_PPP.el_ruff_start_ppp_client(cmux_id);
    console.log('before do ota start');
    //var client_ota = RUFF_OTA.el_ruff_ota_start('ws://68.79.31.165:10025/test_1234');

    gen_os_ota_worker(4).call(null);
    var cmuxUart = new CmuxUart(cmux_id);
    cmuxUart.on('data', function (data) {
        console.log('cmux uart received: ', data);
    });

    cmuxUart.write(new Buffer('AT\r\n'));
}

function ruff_industry_board_init() {
    pinMode(0, OUTPUT);
    console.log('Power off Modem');
    digitalWrite(0, HIGH);

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('Power on Modem');
            digitalWrite(0, LOW);
            resolve();
        }, 2000);
    });
}

function sockTest() {
    console.log('befoer socket connect');
    var socketClient = socket.sockConnect(false, '68.79.31.165', 10025, function (sock) {
        setInterval(function () {
            console.log('before write data to sock');
            sock.write('hello world\n');
            sock.flush();
        }, 2000);
    }, function (data, fd, len) {
        console.log('##### received data', data);
    }, function (err) {
        console.log('#### error is', err);
    }, function () {
        console.log('#### socket closed');
    });
}

function wifiTest() {
    Wifi.startWifi();
    console.log('Before connecting wifi');
    Wifi.connectWifi('nanchao-2', 'nanchao.org', function (status) {
        console.log('wifi event:', status);
        if (status === 'connect') {
            console.log('before wifi test');
            gen_os_ota_worker(4).call(null);
            sockTest();
        }
    });
}
initBoardPinmux();
console.log('#####this is tope test ####');
//uartChipTest();
adcChipTest();
//ruff_industry_board_init().then(function() {
//    console.log('hi this is app');
//    setTimeout(cmux_and_pppos_test, 20000);
//});
//nbTest();
//wifiTest();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function app_test() {
    console.log('this is app test');
}

module.exports = {
    app_test: app_test
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Sht20(i2cInstace) {
    this._i2c = i2cInstace;
}

Sht20.prototype.getTemp = function () {
    var that = this;
    this._i2c.writeByteSync(0xFFFFFFFF, 0xF3);

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var value = that._i2c.readBytesSync(0xFFFFFFFF, 3);
            var data = value[0] << 8 | value[1] & 0xFC;
            var temp = data * 175.72 / Math.pow(2, 16) - 46.85;
            resolve(temp.toFixed(3));
        }, 100);
    });
};

Sht20.prototype.getRelHumid = function () {
    var that = this;
    this._i2c.writeByteSync(0xFFFFFFFF, 0xF5);

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var value = that._i2c.readBytesSync(0xFFFFFFFF, 3);
            var data = value[0] << 8 | value[1] & 0xFC;
            var temp = data * 125.0 / Math.pow(2, 16) - 6;
            resolve(temp.toFixed(3));
        }, 100);
    });
};

module.exports = {
    Sht20: Sht20
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function I2cMaster(i2cNum, options) {
    var sdaPin = options.sdaPin;
    var sclPin = options.sclPin;
    var freq = options.freq;

    this._i2cInstace = i2cInit(i2cNum, sdaPin, sclPin, freq);
}

I2cMaster.prototype.getInstace = function () {
    return this._i2cInstace;
};

function I2cDev(i2cInstace, slaveAddr) {
    this._addr = slaveAddr;
    this._timeout_ms = 1000;
    this._i2cInstace = i2cInstace;
}

I2cDev.prototype.readByteSync = function (offset, timeout) {
    var ret = i2cRead(this._i2cInstace, this._addr, offset, 1, timeout || this._timeout_ms);

    return ret[0];
};

I2cDev.prototype.readBytesSync = function (offset, length, timeout) {
    var ret = i2cRead(this._i2cInstace, this._addr, offset, length, timeout || this._timeout_ms);

    return ret;
};

I2cDev.prototype.readWordSync = function (offset, timeout) {
    var ret = i2cRead(this._i2cInstace, this._addr, offset, 2, timeout || this._timeout_ms);
    var data = (ret[0] & 0xFF) << 8 | ret[1] & 0xFF;
    return data;
};

I2cDev.prototype.writeByteSync = function (offset, data, timeout) {
    var toWrite;
    if (data) {
        toWrite = new Uint8Array(1);
        toWrite[0] = data;
    } else {
        toWrite = new Uint8Array(0);
    }

    i2cWrite(this._i2cInstace, this._addr, offset, Uint8Array.plainOf(toWrite), timeout || this._timeout_ms);
};

I2cDev.prototype.writeWordSync = function (offset, data, timeout) {
    var toWrite = new Uint8Array(2);
    toWrite[0] = (data & 0xFF00) >> 8;
    toWrite[1] = data & 0xFF;
    i2cWrite(this._i2cInstace, this._addr, offset, Uint8Array.plainOf(toWrite), timeout || this._timeout_ms);
};

module.exports = {
    I2cMaster: I2cMaster,
    I2cDev: I2cDev
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CONFIG_REG = 0x00;
var CONFIG_START = 0x01;
var CONFIG_INT_CLEAR = 0x01 << 3;

var INT_STAT_REG = 0x01;
var INT_MASK_REG = 0x03;
var INT_MASK_SETTING = 0xFF;
var CONV_RATE_REG = 0x07;
// Conversion rate
var CONTINU_MODE = 0x01;
var LOWPOWER_MODE = 0x00;

var CHAN_DIS_REG = 0x08;
var ONE_SHOT_REG = 0x09;
var DELAY_ONE_SHOT = 1000;
var CHAN_DIS_SETTING = 0x00;
var DEEP_SHUTDOWN_REG = 0x0A;

var ADV_CONFIG_REG = 0x0B; // select external reference
var EXTERNAL_REF_ENA = 0x01;
var INTERNAL_REF_ENA = 0x00;
var OPERATION_MODE0 = 0x00 << 1; // chan 7 for temp sensor
var OPERATION_MODE1 = 0x01 << 1; // normal
var OPERATION_MODE2 = 0x02 << 1; // 4 diff input + hot temp
var OPERATION_MODE3 = 0x03 << 1; // 4 single, 1 diff + hot temp

var BUSY_STAT_REG = 0x0C;
var LIMIT_REG1 = 0x2A;
var LIMIT_REG2 = 0x30;
var LIMIT_REG3 = 0x31;
var LIMIT_REG4 = 0x32;
var LIMIT_REG5 = 0x33;
var LIMIT_REG6 = 0x34;
var LIMIT_REG7 = 0x35;
var LIMIT_REG8 = 0x36;
var LIMIT_REG9 = 0x37;
var LIMIT_REG10 = 0x38;
var LIMIT_REG11 = 0x39;
var MANUFAC_ID_REG = 0x3E;
var REV_ID_REG = 0x3F;

function Adc(i2cInstace) {
    this._i2c = i2cInstace;
    this.bIntRef = true;
}

Adc.prototype.enADCRef = function () {
    if (this.bIntRef === true) {
        return INTERNAL_REF_ENA;
    } else {
        return EXTERNAL_REF_ENA;
    }
};

function toChannelOffset(chanId) {
    return 0x20 + chanId;
}

function toBoardChanelValue(chanId, value) {
    var ret;
    switch (chanId) {
        case 0:
        case 1:
            ret = value / 5000.0;
            break;
        case 2:
        case 3:
        case 7:
        case 8:
            ret = value * 2.0;
        case 5:
        case 6:
            ret = value * 30.0 / 230;
    }
    return ret.toFixed(4);
}

Adc.prototype.calcVal = function (val) {
    var num = 0.0;

    if (this.bIntRef) {
        num = val * 2.56 / 4096;
    } else {
        num = val * 3.30 / 4096;
    }
    // console.log("num:",num)
    return Number(num.toFixed(4));
};

Adc.prototype.init = function () {
    var value = this.enADCRef() | OPERATION_MODE1;
    this._i2c.writeByteSync(ADV_CONFIG_REG, value);
    //this._i2c.writeByteSync(CONV_RATE_REG, CONTINU_MODE);
    this._i2c.writeByteSync(CONV_RATE_REG, LOWPOWER_MODE);
    this._i2c.writeByteSync(CHAN_DIS_REG, CHAN_DIS_SETTING);
    this._i2c.writeByteSync(INT_MASK_REG, INT_MASK_SETTING);
    this._i2c.writeByteSync(CONFIG_REG, 0x01);
    this._i2c.writeByteSync(DEEP_SHUTDOWN_REG, 0x01);
};

Adc.prototype.readChipInfo = function () {
    var data = this._i2c.readWordSync(MANUFAC_ID_REG);
    return {
        manufacturerID: (data & 0xFF00) >> 8,
        reversionID: data & 0xFF
    };
};

Adc.prototype.readChan = function (chanId) {
    //this._i2c.writeByteSync(toChannelOffset(chanId), null);
    //var value = this._i2c.readWordSync(0xFFFFFFFF);
    var data = this._i2c.readWordSync(toChannelOffset(chanId));
    data = (data & 0xFFF0) >> 4;
    console.log('chainId ' + chanId + ' data : ' + data);
    //value = (value & 0xFF) << 4 | (value & 0xFF00 >> 12)
    var value = this.calcVal(data);
    return toBoardChanelValue(chanId, value);
};

Adc.prototype.start = function () {
    this._i2c.writeByteSync(CONV_RATE_REG, CONTINU_MODE);
    this._i2c.writeByteSync(CONFIG_REG, 0x01);
};

Adc.prototype.stop = function () {
    this._i2c.writeByteSync(CONFIG_REG, 0x0);
    this._i2c.writeByteSync(DEEP_SHUTDOWN_REG, 0x01);
};

Adc.prototype.readChanOneShot = function (chanId) {
    //this._i2c.writeByteSync(CONV_RATE_REG, CONTINU_MODE);
    //this._i2c.writeByteSync(CONFIG_REG, 0x01);
    this._i2c.writeByteSync(CONV_RATE_REG, LOWPOWER_MODE);
    this._i2c.writeByteSync(ONE_SHOT_REG, 0x01);

    var that = this;
    console.log('in readChanOneShot chanId', chanId);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var status = that._i2c.readByteSync(BUSY_STAT_REG);
            var data = that.readChan(chanId);
            console.log('status: ' + status + ' data: ' + data);
            console.log('resolve is', resolve);
            resolve(data);
            //if (data & 0x01) {
            //    console.log('ADC convert busy');
            //    //reject(new Error('ADC convert still busy'));
            //} else {
            //    resolve(data);
            //}
        }, DELAY_ONE_SHOT);
    });
};

module.exports = {
    Adc: Adc
};

/***/ })
/******/ ]);