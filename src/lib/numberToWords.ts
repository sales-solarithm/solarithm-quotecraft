function convertLessThanThousand(n: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  let str = '';
  if (n >= 100) {
    str += units[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += units[n] + ' ';
  }
  return str.trim();
}

function convertIntegerToWords(num: number): string {
  if (num === 0) return 'Zero';

  let remaining = Math.floor(Math.abs(num));
  let words = '';

  // Crores
  const crores = Math.floor(remaining / 10000000);
  if (crores > 0) {
    words += convertLessThanThousand(crores) + ' Crore ';
    remaining %= 10000000;
  }

  // Lakhs
  const lakhs = Math.floor(remaining / 100000);
  if (lakhs > 0) {
    words += convertLessThanThousand(lakhs) + ' Lakh ';
    remaining %= 100000;
  }

  // Thousands
  const thousands = Math.floor(remaining / 1000);
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
    remaining %= 1000;
  }

  // Hundreds & Units
  if (remaining > 0) {
    words += convertLessThanThousand(remaining) + ' ';
  }

  return words.trim();
}

export function numberToWords(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return 'Zero';

  const rounded = Math.round(Number(num) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const paisePart = Math.round((rounded - integerPart) * 100);

  const rupeeWords = integerPart > 0 ? convertIntegerToWords(integerPart) : (paisePart > 0 ? '' : 'Zero');
  const paiseWords = paisePart > 0 ? convertLessThanThousand(paisePart) + ' Paise' : '';

  if (rupeeWords && paiseWords) {
    return `${rupeeWords} and ${paiseWords}`;
  } else if (rupeeWords) {
    return rupeeWords;
  } else if (paiseWords) {
    return paiseWords;
  }
  return 'Zero';
}

