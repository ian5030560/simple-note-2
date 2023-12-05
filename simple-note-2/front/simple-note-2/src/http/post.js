/**
 *
 * @param {string} url
 * @param {any} data
 */
export default function postData(url, data) {
    return fetch(url, {
      credentials: "include",
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "content-type": "application/json",
      },
    })
  }