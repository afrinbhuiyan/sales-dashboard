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

export const getSalesData = async (pageToken = null, filters = {}) => {
  try {
    const token = await ensureToken();

    const getDateString = (offsetDays = 0) => {
      const date = new Date();
      date.setDate(date.getDate() + offsetDays);
      return date.toISOString().split("T")[0];
    };
    const params = {
      startDate: filters.startDate || getDateString(-30), 
      endDate: filters.endDate || getDateString(1), 
      limit: 50
    };

    // Add filters
    if (filters.minPrice) {
      params.minPrice = parseFloat(filters.minPrice);
    }
    if (filters.customerEmail) {
      params.email = filters.customerEmail;
    }
    if (filters.phoneNumber) {
      params.phone = filters.phoneNumber;
    }

    // Add pagination token
    if (pageToken) {
      params.page = pageToken;
    }

    console.log('🔍 API Request:', {
      url: `${BASE_URL}/sales`,
      params,
      hasToken: !!token
    });

    const res = await axios.get(`${BASE_URL}/sales`, {
      params,
      headers: {
        "X-AUTOBIZZ-TOKEN": token,
      },
      timeout: 30000 
    });

    console.log('✅ API Response:', res.data);

    const results = res.data.results || {};
    
    return {
      sales: results.Sales || [],
      beforeToken: results.beforeToken || null,
      afterToken: results.afterToken || null,
      total: results.totalCount || (results.Sales ? results.Sales.length : 0)
    };

  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpire");
      throw new Error("Session expired. Please refresh the page.");
    }
    
    throw error;
  }
};