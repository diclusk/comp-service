import { services } from '@/lib/services';
import { ServiceCard } from '@/app/components/ServiceCard';
import BorderGlow from '@/app/components/BorderGlow';

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 md:px-12">
      <div className="max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tighter mt-[-10] md:text-5xl">
          Layanan Kami
        </h1>
        <p className="mt-2 text-zinc-400 md:text-lg">
          Servis cepat, terpercaya, harga bersahabat buat pelajar.
        </p>
      </div>

      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <BorderGlow
            key={service.slug}
            edgeSensitivity={40}
            glowColor="14 184 166"
            backgroundColor="#071225"
            borderRadius={16}
            glowRadius={20}
            glowIntensity={0.8}
            coneSpread={30}
            animated={false}
            fillOpacity={0.15}
            className="h-full"
          >
            <ServiceCard service={service} />
          </BorderGlow>
        ))}
      </div>
    </div>
  );
}