import { services } from '@/lib/services';
import { ServiceCard } from '@/app/components/ServiceCard';

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 md:px-12">
      <div className="max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tighter md:text-5xl">
          Layanan Kami
        </h1>
        <p className="mt-3 text-zinc-600">
          Servis cepat, terpercaya, harga bersahabat buat pelajar.
        </p>
      </div>

      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}