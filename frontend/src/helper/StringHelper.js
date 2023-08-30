export const formatCurrencyINR = (value) => {
    const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    return currency + "/-"
};

export const dateFormatter = (value) => {
  if (!value) return "";
  
  const date = new Date(value);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate
};

export const percentageFormatter = (value) => {
  const percentage = value * 100;
  return percentage + "%";
}