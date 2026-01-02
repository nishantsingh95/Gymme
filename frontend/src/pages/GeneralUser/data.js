import axios from "axios";

const getMonthlyJoined = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/monthly-member`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const threeDayExpire = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/within-3-days-expiring`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const fourToSevenDaysExpire = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/within-4-7-days-expiring`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const expired = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/expired-member`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const getExpenses = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/general/get-expenses`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const getOutlets = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/general/get-outlets`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

const inActiveMembers = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/inactive-member`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

export {
  getMonthlyJoined,
  threeDayExpire,
  fourToSevenDaysExpire,
  expired,
  inActiveMembers,
  getExpenses,
  getOutlets,
};
