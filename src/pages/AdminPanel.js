import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  fetchUsers,
  fetchServices,
  fetchOrders,
  createUser,
  updateUser,
  deleteUser,
  createService,
  updateService,
  deleteService,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/api';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [modalType, setModalType] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const [usersData, servicesData, ordersData] = await Promise.all([fetchUsers(), fetchServices(), fetchOrders()]);
        setUsers(usersData);
        setServices(servicesData);
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleCreateUser = async (user) => {
    try {
      const newUser = await createUser(user);
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    } catch (err) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      await updateUser(user);
      setUsers(users.map((u) => (u.userId === user.userId ? user : u)));
      toast.success('User updated successfully');
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.userId !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateService = async (service) => {
    try {
      const newService = await createService(service);
      setServices([...services, newService]);
      toast.success('Service created successfully');
    } catch (err) {
      toast.error('Failed to create service');
    }
  };

  const handleUpdateService = async (service) => {
    try {
      await updateService(service);
      setServices(services.map((s) => (s.serviceId === service.serviceId ? service : s)));
      toast.success('Service updated successfully');
    } catch (err) {
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId);
      setServices(services.filter((s) => s.serviceId !== serviceId));
      toast.success('Service deleted successfully');
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const handleCreateOrder = async (order) => {
    try {
      const newOrder = await createOrder(order);
      setOrders([...orders, newOrder]);
      toast.success('Order created successfully');
    } catch (err) {
      toast.error('Failed to create order');
    }
  };

  const handleUpdateOrder = async (order) => {
    try {
      await updateOrder(order);
      setOrders(orders.map((o) => (o.orderId === order.orderId ? order : o)));
      toast.success('Order updated successfully');
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((o) => o.orderId !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const openModal = (type, content = {}) => {
    setModalType(type);
    setModalContent(content);
    setIsEditing(Object.keys(content).length > 0);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent({});
    setIsEditing(false);
  };

  const handleModalSubmit = async () => {
    if (modalType === 'user') {
      if (isEditing) {
        await handleUpdateUser(modalContent);
      } else {
        await handleCreateUser(modalContent);
      }
    } else if (modalType === 'service') {
      if (isEditing) {
        await handleUpdateService(modalContent);
      } else {
        await handleCreateService(modalContent);
      }
    } else if (modalType === 'order') {
      if (isEditing) {
        await handleUpdateOrder(modalContent);
      }
    }
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Panel Administratora</h1>
      <Tabs>
        <TabList>
          <Tab>Użytkownicy</Tab>
          <Tab>Serwisy</Tab>
          <Tab>Zamówienia</Tab>
        </TabList>

        <TabPanel>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal('user')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Dodaj Nowy
            </button>
          </div>
          <div className="flex justify-center">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Imię</th>
                  <th className="py-2 px-4 border-b text-left">Nazwisko</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Rola</th>
                  <th className="py-2 px-4 border-b text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td className="py-2 px-4 border-b text-left">{user.userId}</td>
                    <td className="py-2 px-4 border-b text-left">{user.forename}</td>
                    <td className="py-2 px-4 border-b text-left">{user.surname}</td>
                    <td className="py-2 px-4 border-b text-left">{user.email}</td>
                    <td className="py-2 px-4 border-b text-left">{user.role}</td>
                    <td className="py-2 px-4 border-b text-left">
                      <button
                        onClick={() => openModal('user', user)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal('service')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Dodaj Nowy
            </button>
          </div>
          <div className="flex justify-center">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Nazwa</th>
                  <th className="py-2 px-4 border-b text-left">Opis</th>
                  <th className="py-2 px-4 border-b text-left">Cena</th>
                  <th className="py-2 px-4 border-b text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  return (
                    <tr key={service.serviceId}>
                      <td className="py-2 px-4 border-b text-left">{service.serviceName}</td>
                      <td className="py-2 px-4 border-b text-left">{service.description}</td>
                      <td className="py-2 px-4 border-b text-left">{service.price}</td>
                      <td className="py-2 px-4 border-b text-left">
                        <button
                          onClick={() => openModal('service', service)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.serviceId)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal('order')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Dodaj Nowy
            </button>
          </div>
          <div className="flex justify-center">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Data</th>
                  <th className="py-2 px-4 border-b text-left">Nazwa</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="py-2 px-4 border-b text-left">{order.orderId}</td>
                    <td className="py-2 px-4 border-b text-left">{order.date}</td>
                    <td className="py-2 px-4 border-b text-left">{order.serviceName}</td>
                    <td className="py-2 px-4 border-b text-left">{order.status}</td>
                    <td className="py-2 px-4 border-b text-left">
                      <button
                        onClick={() => openModal('order', order)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Edytuj {modalType}</h2>
        {modalType === 'user' && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="forename"
            >
              Imię
            </label>
            <input
              type="text"
              id="forename"
              name="forename"
              value={modalContent.forename || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="surname"
            >
              Nazwisko
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={modalContent.surname || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={modalContent.email || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {!isEditing && (
              <>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Hasło
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={modalContent.password || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="role"
                >
                  Rola
                </label>
                <select
                  id="role"
                  name="role"
                  value={modalContent.role || 'user'}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="user">User</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </>
            )}
          </div>
        )}
        {modalType === 'service' && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nazwa
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={modalContent.name || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Opis
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={modalContent.description || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Cena
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={modalContent.price || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        {modalType === 'order' && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Data
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={modalContent.date || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Opis
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={modalContent.description || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={handleModalSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Zapisz
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Anuluj
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPanel;
