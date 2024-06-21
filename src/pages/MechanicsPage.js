import React, { useEffect, useState } from 'react';
import { fetchMechanicsOrders, acceptOrder, updateOrderStatus } from '../services/api';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MechanicsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userEmail } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchMechanicsOrders();
        console.log('Fetched orders:', data);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId, userEmail);
      toast.success('Order accepted successfully');
      const updatedOrders = await fetchMechanicsOrders();
      setOrders(updatedOrders);
    } catch (err) {
      toast.error('Failed to accept order');
    }
  };

  const handleStartService = async (order) => {
    try {
      await updateOrderStatus(order.orderId, { status: 'W trakcie', mechanicName: userEmail });
      toast.success('Service started successfully');
      generatePDF(order.serviceName, order.price);
      const updatedOrders = await fetchMechanicsOrders();
      setOrders(updatedOrders);
    } catch (err) {
      toast.error('Failed to start service');
    }
  };

  const generatePDF = (serviceName, price) => {
    const doc = new jsPDF();
    doc.text('Pokwitowanie/Rachunek', 10, 10);
    doc.text('Firma: Januszex', 10, 20);
    doc.text(`Usluga:   ${serviceName}`, 10, 20);
    doc.text(`Cena: ${price + price * 0.2}  PLN`, 10, 30);
    doc.text(`Data: ${new Date().toLocaleString()}`, 10, 40);
    doc.save('rachunek.pdf');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Zlecenia mechaników</h1>
      <div className="flex justify-center">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Nazwa</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="py-2 px-4 border-b text-left">{order.orderId}</td>
                <td className="py-2 px-4 border-b text-left">{order.serviceName || 'Unknown'}</td>
                <td className="py-2 px-4 border-b text-left">{order.status}</td>
                <td className="py-2 px-4 border-b text-left">
                  <button
                    onClick={() => handleAcceptOrder(order.orderId)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    disabled={order.status === 'Zaakceptowano'}
                  >
                    {order.status === 'Zaakceptowano' ? 'Zaakceptowano' : 'Zaakceptuj zlecenie'}
                  </button>
                  {order.status === 'Części wydane' && (
                    <button
                      onClick={() => handleStartService(order)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Rozpocznij serwis
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MechanicsPage;
