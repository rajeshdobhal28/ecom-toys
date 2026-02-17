import Shop from '@/app/shop/shop';

export default async function Category({ params }: { params: Promise<{ category: string }> }) {
    return <Shop params={params} />
}