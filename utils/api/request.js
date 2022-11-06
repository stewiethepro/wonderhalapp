let cache = {};
const request = (url, params = {}, method = "GET") => {

  let options = {
    method,
    headers: new Headers({ 
    'Accept': 'application/json',
    'Content-Type': 'application/json', 
    }),
  };
  if ("GET" === method) {
    url += "?" + new URLSearchParams(params).toString();
  } else {
    options.body = JSON.stringify(params)
  }

  const result = fetch(url, options).then((response) =>
    response.json());

  return result;
};

export const get = (url, params) => request(url, params, "GET");
export const post = (url, params) => request(url, params, "POST");
