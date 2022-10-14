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

// console.log(angkaTerbilang(2150880));
