export const formatPhoneNumber = (value) => {
  const phone = value.replace(/\D/g, ""); // Remove all non-digit characters
  if (phone.length <= 3) {
    return phone;
  } else if (phone.length <= 6) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
  } else {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  }
};
