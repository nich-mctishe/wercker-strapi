'use strict';

/**
 * Lifecycle callbacks for the `Orders` model.
 */
const createOrderNumber = require('../../../lib/orderNumbers.js')
const Email = require('../../../lib/email')

const getProduct = async identifier => await strapi.services.products.fetch(identifier)

const handleItems = {
  formatForDB: async items => await items.map(async item => {
    let identifier = { _id: item.product }
    if (!item.product) {
      identifier = { sku: item.sku }
    }
    const product = await getProduct(identifier)

    return `${item.quantity} x ${product.name}${product.sku ? ' (' + product.sku + ') ' : ' '}- ${item.size} = ${item['total-cost']}`
  }).join(',\n'),
  // if issues try await Promise.all
  formatForInternalUse: async (items, id) => {
    return await Promise.all(items.split(',\n').map(async item => {
      // split into sections
      const start = item.split(' x ')
      const ending = start[1].split(' - ')
      const equals = ending[1].split(' = ')
      const sku = item.match(/\(\w+\)/g)
      let identifier = {}

      if (sku) {
        identifier.sku = sku[0].substr(1, sku[0].length - 2)
      } else {
        identifier.Name = start[0].split(' (')[0]
      }

      return {
        order: id,
        product: await getProduct(identifier),
        size: equals[0],
        quantity: start[0],
        'total-cost': Number(equals[1])
      }
    }))
  }
}

const send = async (master, data) => {
  if (data.items) {
    const email = new Email(
      data,
      await handleItems.formatForInternalUse(data.items, data._id),
      await strapi.services.social.fetchAll(),
      await strapi.services.contactdetails.fetch({ slug: 'email' }),
      await strapi.services.deliveryoptions.fetch({ _id: data.deliveryoptions })
    )

    // still need to work out items
    await email.send(master, (err, email) => {
      if (err) {
        return console.error(err)
      }
    })
  }
}

const beforeCreateOrUpdate = async (model) => {
  // if no order number -> generate one
  const data = model['_update'] || model

  if (!data.number) {
    // ensure its unique
    data.number = createOrderNumber()
  }
  // if paid and no paid date --> generate one
  if (data.paid && !data['date-paid-for']) {
    data['date-paid-for'] = new Date()
  }
  // if no placed date --> generate one
  if (!data['date-placed']) {
    data['date-placed'] = new Date()
  }
  // if shipped and no shipped date --> generate one
  if (data.shipped && !data['date-shipped']) {
    data['date-shipped'] = new Date()
  }
  // to do: check and count all monies to double chefk they arnt being manipulated
  let option = await strapi.services.deliveryoptions.get(data.shippingcountry || '')
  data.deliveryoptions = option._id

  // may have to ensure its a string before it gets here. <-- pre validation
  if (data.items instanceof Array) {
    // turn the array into something that will fit on the page.
    data.items = await handleItems.formatForDB(data.items)
  }
}
/**
 * TODO: make it so that when a new item is saved an email is sent out to the receipient
 * case1: user not paid --> sned out not paid email to contact rasha and get payment -- or try again later.
 *        could have retrieval system
 * case2: paid, but not shipped --> send out order conf email w/info
 * case3: paid and shipped --> send out email saying order is on its way and normal order times.
 */
const afterCreateOrUpdate = async (model, result) => {
  const data = model['_update'] || model

   if (!data.paid) {
     // user not paid email, with refs to rasha and link to repopulate basket.
     await send('saved', data)
   }

   if (data.paid && !data.shipped) {
     // send out order conf email with run through, addresses and let know when shipping will happen
     await send('placed', data)
     await send('rasha', data)
   }

   if (data.shipped) {
     // send out shipping email with date estimation
     await send('shipped', data)
   }
}

module.exports = {
  // Before saving a value.
  // Fired before an `insert` or `update` query.
  // beforeSave: async (model) => {},
  // After saving a value.
  // Fired after an `insert` or `update` query.
  // afterSave: async (model, result) => {},

  // Before fetching all values.
  // Fired before a `fetchAll` operation.
  // beforeFetchAll: async (model) => {},

  // After fetching all values.
  // Fired after a `fetchAll` operation.
  // afterFetchAll: async (model, results) => {},

  // Fired before a `fetch` operation.
  // beforeFetch: async (model) => {},

  // After fetching a value.
  // Fired after a `fetch` operation.
  // afterFetch: async (model, result) => {},

  // Before creating a value.
  // Fired before an `insert` query.
  // beforeCreate: async (model) => {},
  beforeCreate: beforeCreateOrUpdate,

  // After creating a value.
  // Fired after an `insert` query.
  // afterCreate: async (model, result) => {},
  afterCreate: afterCreateOrUpdate,
  // Before updating a value.
  // Fired before an `update` query.
  // beforeUpdate: async (model) => {},
  beforeUpdate: beforeCreateOrUpdate,

  // After updating a value.
  // Fired after an `update` query.
  // afterUpdate: async (model, result) => {},
  afterUpdate: afterCreateOrUpdate,

  // Before destroying a value.
  // Fired before a `delete` query.
  // beforeDestroy: async (model) => {},

  // After destroying a value.
  // Fired after a `delete` query.
  // afterDestroy: async (model, result) => {}
};
