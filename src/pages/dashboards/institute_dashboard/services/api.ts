export const submitRequest = async (requestData: FormData) => {
  const response = await fetch("http://localhost:5050/api/requests", {
    method: "POST",
    body: requestData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to submit request");
  }

  return response.json();
};
