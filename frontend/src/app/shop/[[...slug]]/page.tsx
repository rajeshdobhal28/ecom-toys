import Shop from '@/app/shop/shop';

export default async function ShopPage({ params }: { params: Promise<{ category: string }> }) {
    return <Shop params={params} />
}