import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Generic API request function with error handling
 * @param method - HTTP method
 * @param url - API endpoint URL
 * @param data - Request data (for POST, PUT, etc.)
 * @param config - Additional Axios config
 * @returns Promise with response data
 */
export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response: AxiosResponse;

    switch (method) {
      case 'get':
        response = await axios.get(url, config);
        break;
      case 'post':
        response = await axios.post(url, data, config);
        break;
      case 'put':
        response = await axios.put(url, data, config);
        break;
      case 'delete':
        response = await axios.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

/**
 * Handle API errors
 * @param error - Axios error object
 */
const handleApiError = (error: AxiosError): void => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error Request:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
  }
};

/**
 * Check if an API key is required and validate it
 * @param apiKey - The API key to validate
 * @returns Boolean indicating if the API key is valid
 */
export const validateApiKey = (apiKey: string | null): boolean => {
  if (!apiKey) {
    console.error('API key is required but not provided');
    return false;
  }
  
  // In a real implementation, you might want to validate the format or do a test request
  // This is a simplified check
  return apiKey.length > 0;
};

/**
 * Format API parameters for different API providers
 * @param params - The parameters to format
 * @param provider - The API provider
 * @returns Formatted parameters
 */
export const formatApiParams = (params: Record<string, any>, provider: string): Record<string, any> => {
  switch (provider.toLowerCase()) {
    case 'eurlex':
      return {
        text: params.query,
        domain: params.jurisdiction || 'ALL',
        ...params
      };
    case 'usgov':
      return {
        conditions: { term: params.query },
        fields: params.fields || ['title', 'abstract', 'document_number'],
        ...params
      };
    default:
      return params;
  }
};