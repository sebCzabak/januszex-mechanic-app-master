import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7192/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchServices = async () => {
  try {
    const response = await api.get('service/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchMechanicsOrders = async () => {
  try {
    const response = await api.get('order/mechanic-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching mechanics orders:', error);
    throw error;
  }
};

export const fetchWarehouseParts = async () => {
  try {
    const response = await api.get('part/parts');
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouse parts:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('user/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
export const fetchPartRequests = async () => {
  const response = await api.get('order/part-requests');
  return response.data;
};

export const acceptOrder = async (orderId, mechanicName) => {
  await api.put(`order/orders/${orderId}/status`, { status: 'accepted', mechanicName });
};
export const updateOrderStatus = async (orderId, statusUpdate) => {
  await api.put(`/order/orders/${orderId}/status`, statusUpdate);
};

export const requestParts = async (orderId, partRequestData) => {
  await api.post(`order/orders/${orderId}/parts`, { partRequestData });
};

export const issueParts = async (data) => {
  const response = await api.put('part/issue-parts', data);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('order/orders');
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post('user', user);
  return response.data;
};

export const updateUser = async (user) => {
  const response = await api.put(`user/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`user/${userId}`);
  return response.data;
};

export const createService = async (service) => {
  const response = await api.post('service', service);
  return response.data;
};

export const updateService = async (service) => {
  const response = await api.put(`service/services/${service.serviceId}`, service);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`service/${serviceId}`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('order/create', order);
  return response.data;
};

export const updateOrder = async (order) => {
  const response = await api.put(`order/${order.id}`, order);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`order/${orderId}`);
  return response.data;
};

export default api;
