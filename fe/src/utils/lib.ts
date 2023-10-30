export function convertToAngka(price) {
  return parseInt(price.replace(/,/g, ''), 10);
}

export function generateRandomAlphanumeric() {
  const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

export function getCookie(name: string) {
  const re = new RegExp(name + '=([^;]+)');
  const value = re.exec(document.cookie);
  return value != null ? unescape(value[1]) : '';
}
