const WOLFRAM_ALPHA_APP_ID = '9G6YK7-Y8QVUUAWLQ';

/** https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors */
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

async function wolframAlphaQuery(input) {
  let uri = `http://api.wolframalpha.com/v2/query?` +
    `input=${input}` +
    `&appid=${WOLFRAM_ALPHA_APP_ID}` +
    `&format=plaintext` +
    `&output=json` +
    `&includepodid=Result`;

  uri = encodeURI(uri);

  // console.log(uri);

  return await fetch(proxyUrl + uri);
}

export class WolframAlphaCalculator {
  async calc(expression, variable, range) {
    // const expression = `x * 2`;
    // const variable = 'x';
    // const range = [0.7, 10, 4];

    // build input for Wolfram Alpha. Example: 'calc x * 2 where x is 0.7, 10, 4'
    const input = `calc ${expression} where ${variable} is ` + range.join(', ');
    console.log({input});

    const response = await wolframAlphaQuery(input);
    const json = await response.json();
    const text = json.queryresult.pods.find(pod => pod.id === 'Result').subpods[0].plaintext; // {n,n,n,n}

    return (text || '')
    // delete braces
      .replace(/^{/, '')
      .replace(/}$/, '')
      // split numbers
      .split(/\s*,\s*/)
      // convert to floats
      .map(s => parseFloat(s))
      // build x,y pairs
      .map((n, index) => [range[index], n]);
  }
}
