import axios from "axios";

const BASE_URL = "https://autobizz-425913.uc.r.appspot.com";

const getToken = async () => {
  const res = await axios.post(`${BASE_URL}/getAuthorize`, {
    tokenType: "frontEndTest",
  });
  const { token, expire } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpire", Date.now() + expire * 1000); 
  return token;
};

const ensureToken = async () => {
  const token = localStorage.getItem("token");
  const expire = localStorage.getItem("tokenExpire");
  if (!token || !expire || Date.now() > parseInt(expire)) {
    return await getToken();
  }
  return token;
};

const getDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

export const getSalesData = async () => {
  const token = await ensureToken();

  const endDate = getDateString(0);
  const startDate = "2025-01-01";

  console.log("Requesting sales from:", startDate, "to", endDate);

  const res = await axios.get(`${BASE_URL}/sales`, {
    params: {
      startDate,
      endDate,
    },
    headers: {
      "X-AUTOBIZZ-TOKEN": token,
    },
  });

  console.log("Full Response:", res.data);
  return res.data.results.Sales;
};
