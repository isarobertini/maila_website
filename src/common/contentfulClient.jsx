import { createClient } from 'contentful';

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getNavigationItems() {
    const response = await client.getEntries({ content_type: 'navigationItem', order: 'fields.order' });

    return response.items.map((item) => ({
        title: item.fields.title,
        slug: item.fields.slug,
    }));
}
