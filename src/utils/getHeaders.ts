interface Headers {
  'X-Api-Key': string;
  Authorization?: string;
}

const getHeaders = (xApiKey: string): Headers => {
  return {
    'X-Api-Key': xApiKey,
  };
};

export default getHeaders;
