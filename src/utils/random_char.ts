const createRandomChar = (): string => {
  let S = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)).join(''); // a-z
  S += S.toUpperCase(); // A-Z
  S += '0123456789'; // 0-9
  const N = 16; // 文字数
  const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
    .map((n) => S[n % S.length])
    .join('');
  return randomChar;
};

export default createRandomChar;
