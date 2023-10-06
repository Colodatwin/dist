const postData = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    body: data,
    headers: {
      'Content-type': 'application/json'
    }
  });
  return await res.json();
};
function changeZero(num) {
  if (num >= 0 && num < 10) {
    return `0${num}`
  } else {
    return num;
  }
}
const getResource = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fecth ${url}, status: ${res.status}`);
  }

  return await res.json();
};

export {postData, changeZero, getResource};