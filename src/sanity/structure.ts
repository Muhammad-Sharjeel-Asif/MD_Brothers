import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Admin Panel')
    .items([
      S.listItem()
        .title('Storefront')
        .child(
          S.list()
            .title('Storefront')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Sales')
        .child(
          S.list()
            .title('Sales')
            .items([
              S.documentTypeListItem('order').title('Orders'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Marketing')
        .child(
          S.list()
            .title('Marketing')
            .items([
              S.documentTypeListItem('discount').title('Discounts'),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(item => !['product', 'category', 'order', 'discount'].includes(item.getId() || '')),
    ])
