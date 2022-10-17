/**
 * function untuk membuat format angka
 *
 * @param {number|string} number (angka)
 * @param {string} decimals (jumlah desimal)
 * @param {string} dec_point (simbol pemisah desimal)
 * @param {string} thousands_sep (simbol pemisah ribuan)
 * @returns {string}
 */
function number_format(
  number,
  decimals = 0,
  dec_point = ',',
  thousands_sep = '.'
) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// example:
// console.log(number_format('950000.78'));

/**
 * function untuk membuat format tanggal indonesia
 *
 * @param {string|number} date
 * @returns {string} date
 */
function format_tanggal(date) {
  return new Date(date).toLocaleString('id-ID', {
    // weekday: 'long', // long, short, narrow
    day: 'numeric', // numeric, 2-digit
    year: 'numeric', // numeric, 2-digit
    month: 'long', // numeric, 2-digit, long, short, narrow
    // hour: 'numeric', // numeric, 2-digit
    // minute: 'numeric', // numeric, 2-digit
    // second: 'numeric', // numeric, 2-digit
  });
}

// example:
// console.log(format_tanggal('2022-07-14'));

/**
 *
 * @param {Number|String} number
 * @param Object settings
 * @returns
 */
function angkaTerbilang(number = 0, settings = { decimal: '.' }) {
  const units = [
    '',
    'ribu',
    'juta',
    'milyar',
    'triliun',
    'quadriliun',
    'quintiliun',
    'sextiliun',
    'septiliun',
    'oktiliun',
    'noniliun',
    'desiliun',
    'undesiliun',
    'duodesiliun',
    'tredesiliun',
    'quattuordesiliun',
    'quindesiliun',
    'sexdesiliun',
    'septendesiliun',
    'oktodesiliun',
    'novemdesiliun',
    'vigintiliun',
  ];
  const maxIndex = units.length - 1;
  function digitToUnit(digit) {
    const curIndex = digit / 3;
    return curIndex <= maxIndex ? units[curIndex] : units[maxIndex];
  }

  const numbers = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
  ];

  function numberToText(index) {
    return numbers[index] || '';
  }

  const terbilang = angka => {
    const angkaLength = angka.length;
    const angkaMaxIndex = angkaLength - 1;

    // Angka Nol
    if (angkaMaxIndex === 0 && Number(angka[0]) === 0) {
      return 'nol';
    }

    let space = '';
    let result = '';

    let i = 0;
    while (i !== angkaLength) {
      const digitCount = angkaMaxIndex - i;
      const modGroup = digitCount % 3; // [2,1,0]
      const curAngka = Number(angka[i]);

      if (
        digitCount === 3 &&
        curAngka === 1 &&
        (i === 0 || (Number(angka[i - 2]) === 0 && Number(angka[i - 1]) === 0))
      ) {
        /* Angka Seribu */
        result += `${space}seribu`;
      } else {
        if (curAngka !== 0) {
          if (modGroup === 0) {
            /* Angka Satuan Bukan Nol */
            result += `${space}${numberToText(curAngka)}${
              i === angkaMaxIndex ? '' : ' '
            }${digitToUnit(digitCount)}`;
          } else if (modGroup === 2) {
            /* Angka Ratusan */
            if (curAngka === 1) {
              result += `${space}seratus`;
            } else {
              result += `${space}${numberToText(curAngka)} ratus`;
            }
          } else {
            /* Angka Sepuluh dan Belasan */
            if (curAngka === 1) {
              i++; // Skip Next Angka
              const nextAngka = Number(angka[i]);
              if (nextAngka === 0) {
                result += `${space}sepuluh`;
                /* Proses Next Angka Sekarang */
                if (
                  digitCount !== 1 &&
                  (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0)
                ) {
                  result += ` ${digitToUnit(digitCount - 1)}`;
                }
              } else {
                if (nextAngka === 1) {
                  result += `${space}sebelas`;
                } else {
                  result += `${space}${numberToText(nextAngka)} belas`;
                }
                /* Proses Next Angka Sekarang */
                if (digitCount !== 1) {
                  result += ` ${digitToUnit(digitCount - 1)}`;
                }
              }
            } else {
              /* Angka Puluhan */
              result += `${space}${numberToText(curAngka)} puluh`;
            }
          }
        } else {
          /* Angka Satuan Nol */
          if (
            modGroup === 0 &&
            (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0) &&
            digitCount !== 0
          ) {
            result += ` ${digitToUnit(digitCount)}`;
          }
        }
      }

      if (i <= 1) {
        space = ' ';
      }
      i++;
    }

    return result;
  };

  const terbilangSatuSatu = angka => {
    return angka
      .split('')
      .map(angka => (angka == 0 ? 'nol' : numberToText(angka)))
      .join(' ');
  };

  if (typeof number !== 'string') number = String(number);
  if (number.indexOf(settings.decimal) > -1) {
    /* Dengan Desimal */
    number = number.split(settings.decimal);
    return `${terbilang(number[0])} koma ${terbilangSatuSatu(number[1])}`
      .toLowerCase()
      .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
  } else {
    /* Tanpa Desimal */
    return `${terbilang(number)}`
      .toLowerCase()
      .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
  }
}

// example
// console.log(angkaTerbilang(2150880));

/**
 * 
 * @param {Date} dateVal 
 * @param {String} formatVal 
 * @returns 
 */  
function date_format(dateVal, formatVal) {
  // Defining locale
  Date.shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  Date.longMonths = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  Date.shortDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  Date.longDays = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  // Defining patterns
  var replaceChars = {
    // Day
    d: function () {
      var d = this.getDate();
      return (d < 10 ? '0' : '') + d;
    },
    D: function () {
      return Date.shortDays[this.getDay()];
    },
    j: function () {
      return this.getDate();
    },
    l: function () {
      return Date.longDays[this.getDay()];
    },
    N: function () {
      var N = this.getDay();
      return N === 0 ? 7 : N;
    },
    S: function () {
      var S = this.getDate();
      return S % 10 === 1 && S !== 11
        ? 'st'
        : S % 10 === 2 && S !== 12
        ? 'nd'
        : S % 10 === 3 && S !== 13
        ? 'rd'
        : 'th';
    },
    w: function () {
      return this.getDay();
    },
    z: function () {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this - d) / 86400000);
    },
    // Week
    W: function () {
      var target = new Date(this.valueOf());
      var dayNr = (this.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      var retVal = 1 + Math.ceil((firstThursday - target) / 604800000);
      return retVal < 10 ? '0' + retVal : retVal;
    },
    // Month
    F: function () {
      return Date.longMonths[this.getMonth()];
    },
    m: function () {
      var m = this.getMonth();
      return (m < 9 ? '0' : '') + (m + 1);
    },
    M: function () {
      return Date.shortMonths[this.getMonth()];
    },
    n: function () {
      return this.getMonth() + 1;
    },
    t: function () {
      var year = this.getFullYear();
      var nextMonth = this.getMonth() + 1;
      if (nextMonth === 12) {
        year = year++;
        nextMonth = 0;
      }
      return new Date(year, nextMonth, 0).getDate();
    },
    // Year
    L: function () {
      var L = this.getFullYear();
      return L % 400 === 0 || (L % 100 !== 0 && L % 4 === 0);
    },
    o: function () {
      var d = new Date(this.valueOf());
      d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
      return d.getFullYear();
    },
    Y: function () {
      return this.getFullYear();
    },
    y: function () {
      return ('' + this.getFullYear()).substr(2);
    },
    // Time
    a: function () {
      return this.getHours() < 12 ? 'am' : 'pm';
    },
    A: function () {
      return this.getHours() < 12 ? 'AM' : 'PM';
    },
    B: function () {
      return Math.floor(
        ((((this.getUTCHours() + 1) % 24) +
          this.getUTCMinutes() / 60 +
          this.getUTCSeconds() / 3600) *
          1000) /
          24
      );
    },
    g: function () {
      return this.getHours() % 12 || 12;
    },
    G: function () {
      return this.getHours();
    },
    h: function () {
      var h = this.getHours();
      return ((h % 12 || 12) < 10 ? '0' : '') + (h % 12 || 12);
    },
    H: function () {
      var H = this.getHours();
      return (H < 10 ? '0' : '') + H;
    },
    i: function () {
      var i = this.getMinutes();
      return (i < 10 ? '0' : '') + i;
    },
    s: function () {
      var s = this.getSeconds();
      return (s < 10 ? '0' : '') + s;
    },
    v: function () {
      var v = this.getMilliseconds();
      return (v < 10 ? '00' : v < 100 ? '0' : '') + v;
    },
    // Timezone
    e: function () {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    I: function () {
      var DST = null;
      for (var i = 0; i < 12; ++i) {
        var d = new Date(this.getFullYear(), i, 1);
        var offset = d.getTimezoneOffset();
        if (DST === null) DST = offset;
        else if (offset < DST) {
          DST = offset;
          break;
        } else if (offset > DST) break;
      }
      return (this.getTimezoneOffset() === DST) | 0;
    },
    O: function () {
      var O = this.getTimezoneOffset();
      return (
        (-O < 0 ? '-' : '+') +
        (Math.abs(O / 60) < 10 ? '0' : '') +
        Math.floor(Math.abs(O / 60)) +
        (Math.abs(O % 60) === 0
          ? '00'
          : (Math.abs(O % 60) < 10 ? '0' : '') + Math.abs(O % 60))
      );
    },
    P: function () {
      var P = this.getTimezoneOffset();
      return (
        (-P < 0 ? '-' : '+') +
        (Math.abs(P / 60) < 10 ? '0' : '') +
        Math.floor(Math.abs(P / 60)) +
        ':' +
        (Math.abs(P % 60) === 0
          ? '00'
          : (Math.abs(P % 60) < 10 ? '0' : '') + Math.abs(P % 60))
      );
    },
    T: function () {
      var tz = this.toLocaleTimeString(navigator.language, {
        timeZoneName: 'short',
      }).split(' ');
      return tz[tz.length - 1];
    },
    Z: function () {
      return -this.getTimezoneOffset() * 60;
    },
    // Full Date/Time
    c: function () {
      return this.format('Y-m-d\\TH:i:sP');
    },
    r: function () {
      return this.toString();
    },
    U: function () {
      return Math.floor(this.getTime() / 1000);
    },
  };
  // Simulates PHP's date function
  var date = new Date(dateVal);
  return formatVal.replace(/(\\?)(.)/g, function (_, esc, chr) {
    return esc === '' && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
  });
}

// example:
// console.log(date_format(new Date('2022-05-07'), 'd F Y'));
