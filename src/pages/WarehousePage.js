import React, { useEffect, useState } from 'react';
import { fetchWarehouseParts, fetchPartRequests, issueParts } from '../services/api';
import api from '../services/api'; // Import the api module
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

Modal.setAppElement('#root');

const WarehousePage = () => {
  const [parts, setParts] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [quantity, setQuantity] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    const getParts = async () => {
      try {
        const partsData = await fetchWarehouseParts();
        const partRequestsData = await fetchPartRequests();
        console.log('Fetched parts:', partsData);
        console.log('Fetched part requests:', partRequestsData);
        setParts(partsData);
        setPartRequests(partRequestsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getParts();
  }, []);

  const openModal = (request) => {
    console.log('Opening modal for request:', request);
    setSelectedRequest(request);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRequest(null);
    setSelectedPartId('');
    setQuantity('');
  };

  const generatePDF = (issuedParts) => {
    const doc = new jsPDF();
    doc.text('WYDANIE ZEWNETRZNE', 10, 10);
    doc.text('Firma: Januszex', 10, 20);
    doc.text(`Mechanik: ${selectedRequest.mechanicName}`, 10, 30);
    doc.text(`Data: ${new Date().toLocaleString()}`, 10, 40);

    doc.text('Czesci:', 10, 50);
    doc.autoTable({
      startY: 60,
      head: [['ID', 'Nazwa', 'Ilosc']],
      body: issuedParts.map((part) => [part.partId, part.name, part.quantity]),
    });

    doc.save('WydanieZewnetrzne.pdf');
  };

  const handleIssueParts = async () => {
    if (!selectedRequest || !selectedPartId || !quantity) return;

    const issueData = {
      requestId: selectedRequest.requestId,
      parts: [
        {
          partId: parseInt(selectedPartId, 10),
          quantity: parseInt(quantity, 10),
        },
      ],
    };

    console.log('Issuing parts with data:', issueData);

    try {
      await issueParts(issueData);

      const issuedParts = issueData.parts.map((part) => {
        const partInfo = parts.find((p) => p.partId === part.partId);
        return {
          partId: part.partId,
          name: partInfo ? partInfo.name : 'Unknown Part',
          quantity: part.quantity,
        };
      });

      console.log('Issued parts:', issuedParts);

      generatePDF(issuedParts);

      console.log(`Updating status for requestId: ${selectedRequest.requestId}`);
      await api.put(`order/orders/${selectedRequest.requestId}/status`, {
        status: 'Części wydane',
        mechanicName: selectedRequest.mechanicName,
      });

      toast.success('Parts issued successfully');

      const updatedRequests = partRequests.map((request) =>
        request.requestId === selectedRequest.requestId ? { ...request, status: 'Części wydane' } : request
      );
      setPartRequests(updatedRequests);

      closeModal();

      const partsData = await fetchWarehouseParts();
      setParts(partsData);
    } catch (err) {
      console.error('Failed to issue parts:', err);
      toast.error('Failed to issue parts');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Magazyn</h1>
      <div className="flex justify-center mb-8">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Nazwa</th>
              <th className="py-2 px-4 border-b text-left">Ilość</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.partId}>
                <td className="py-2 px-4 border-b text-left">{part.partId}</td>
                <td className="py-2 px-4 border-b text-left">{part.name}</td>
                <td className="py-2 px-4 border-b text-left">{part.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Zapytania o części</h2>
      <div className="flex justify-center">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Mechanik</th>
              <th className="py-2 px-4 border-b text-left">Części</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {partRequests.map((request) => (
              <tr key={request.requestId}>
                <td className="py-2 px-4 border-b text-left">{request.requestId}</td>
                <td className="py-2 px-4 border-b text-left">{request.mechanicName}</td>
                <td className="py-2 px-4 border-b text-left">{request.parts}</td>
                <td className="py-2 px-4 border-b text-left">{request.status}</td>
                <td className="py-2 px-4 border-b text-left">
                  {request.status !== 'Części wydane' ? (
                    <button
                      onClick={() => openModal(request)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Wydaj części
                    </button>
                  ) : (
                    <button
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                      disabled
                    >
                      Wydano
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Wydaj części"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Wydaj części</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="select-part"
          >
            Wybierz część
          </label>
          <select
            id="select-part"
            value={selectedPartId}
            onChange={(e) => setSelectedPartId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Part</option>
            {parts.map((part) => (
              <option
                key={part.partId}
                value={part.partId}
              >
                {part.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quantity"
          >
            Ilość
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleIssueParts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Wydaj
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

export default WarehousePage;
