import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import { order } from './order'
import { discount } from './discount'
import { shippingSettings } from './shippingSettings'
import { shippingZone } from './shippingZone'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, order, discount, shippingSettings, shippingZone],
}
