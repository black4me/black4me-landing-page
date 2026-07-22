import { getAllOffers } from '../../../../server/actions/offers';
import OfferEditor from './OfferEditor';

export const revalidate = 0;

export default async function AdminOffersPage() {
  const offers = await getAllOffers();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة العروض والهدايا</h1>
          <p className="text-gray-400">تحكم بصفحات الهبوط، الهدايا المجانية، والعروض الخاصة</p>
        </div>
      </div>
      
      <OfferEditor initialOffers={offers} />
    </div>
  );
}
