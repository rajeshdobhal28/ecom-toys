import Shop from '@/app/shop/page';

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  return <Shop params={params} />;
}
