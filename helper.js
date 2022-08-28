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
  dec_point = '.',
  thousands_sep = '.'
) {
  // Strip all characters but numerical ones.
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
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
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
// console.log(number_format('950000.78', '2', ',', '.'));

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
