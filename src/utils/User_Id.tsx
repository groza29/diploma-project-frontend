const getUserID = (token: string): string => {
  return JSON.parse(atob(token.split('.')[1])).id;
};

export default getUserID;
