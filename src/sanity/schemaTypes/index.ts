import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import { order } from './order'
import { discount } from './discount'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, order, discount],
}
