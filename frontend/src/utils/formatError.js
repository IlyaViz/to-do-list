export const formatFieldErrors = (error, alternativeText) => {
  if (!error?.response?.data) {
    return alternativeText;
  }

  return Object.entries(error.response.data).reduce(
    (acc, [field, messages]) => {
      const capitalizedField = field[0].toUpperCase() + field.slice(1);
      const lowercaseMessages = messages.map((msg) => msg.toLowerCase());

      return acc + `${capitalizedField}: ${lowercaseMessages.join(", ")}\n`;
    },
    "",
  );
};

export const formatError = (error, alternativeText) => {
  if (!error?.response?.data?.detail) {
    return alternativeText;
  }

  const detail = error.response.data.detail;
  const capitalizedDetail = detail[0].toUpperCase() + detail.slice(1);

  return capitalizedDetail;
};
