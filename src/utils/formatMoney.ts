export const formatMoney = (value) => {
  // format value that looks like "20.0" into having 2 decimal places
  return (Number(Math.floor(value * 100).toFixed(0)) / 100).toFixed(2);
};
