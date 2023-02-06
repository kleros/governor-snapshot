export const capitalizeString = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const monthIndexToAbbrev = (index: number) => {
  return {
    0: "Jan",
    1: "Feb",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  }[index];
};

export const shortenEthAddress = (address: string) => {
  return `${address.substring(0, 7)}...${address.substring(
    address.length - 7,
    address.length
  )}`;
};
