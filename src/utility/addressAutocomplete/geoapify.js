export const geoapify = async (e, setAddress) => {
  const { value } = e.target;
  const requestOptions = {
    method: "GET",
  };

  await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${
      import.meta.env.VITE_GEOAPIFY_API_KEY
    }`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => setAddress(result))
    .catch((error) => console.log("error", error));
};
