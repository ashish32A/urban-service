import { useParams } from 'react-router-dom';

export default function VendorProfilePage() {
  const { vendorId } = useParams();
  return (
    <div className="container-app py-12 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold text-secondary-500 mb-4">Vendor Profile</h1>
      <p className="text-gray-500">Vendor ID: {vendorId}</p>
    </div>
  );
}
