const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
};

// Helper function to add CSRF token to headers
const getCsrfHeaders = () => {
  const csrftoken = getCookie('csrftoken');
  return {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken,
  };
};

// --- Product API Calls ---
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/productos/`);
  return handleResponse(response);
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/productos/`, {
    method: 'POST',
    headers: getCsrfHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const updateProduct = async (scanning, productData) => {
  const response = await fetch(`${API_BASE_URL}/productos/${scanning}/`, {
    method: 'PUT',
    headers: getCsrfHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteProduct = async (scanning) => {
  const response = await fetch(`${API_BASE_URL}/productos/${scanning}/`, {
    method: 'DELETE',
    headers: getCsrfHeaders(), // Add CSRF token for DELETE
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.status === 204 ? null : response.json(); // No content for 204
};

// --- Vencimiento API Calls ---
export const getVencimientosPriorityList = async () => {
  const response = await fetch(`${API_BASE_URL}/vencimientos/priority_list/`);
  return handleResponse(response);
};

export const createVencimiento = async (vencimientoData) => {
  const response = await fetch(`${API_BASE_URL}/vencimientos/`, {
    method: 'POST',
    headers: getCsrfHeaders(),
    body: JSON.stringify(vencimientoData),
  });
  return handleResponse(response);
};

export const updateVencimiento = async (id, vencimientoData) => {
  const response = await fetch(`${API_BASE_URL}/vencimientos/${id}/`, {
    method: 'PUT',
    headers: getCsrfHeaders(),
    body: JSON.stringify(vencimientoData),
  });
  return handleResponse(response);
};

export const deleteVencimiento = async (id) => {
  const response = await fetch(`${API_BASE_URL}/vencimientos/${id}/`, {
    method: 'DELETE',
    headers: getCsrfHeaders(), // Add CSRF token for DELETE
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.status === 204 ? null : response.json(); // No content for 204
};