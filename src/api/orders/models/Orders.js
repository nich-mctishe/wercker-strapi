'use strict';

/**
 * Lifecycle callbacks for the `Orders` model.
 */

 /**
  * TODO: put mailgun deets here
  * private classes also.
  * could also call Emails list.
  */

  const beforeCreateOrUpdate = async (model) => {
    // if no order number -> generate one
    const data = model['_update'] || model

    if (!data.number) {
      data.number = 'TEST1234'
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
  }

  const afterCreateOrUpdate = async (model, result) => {
    /**
     * TODO: make it so that when a new item is saved an email is sent out to the receipient
     * case1: user not paid --> sned out not paid email to contact rasha and get payment -- or try again later.
     *        could have retrieval system
     * case2: paid, but not shipped --> send out order conf email w/info
     * case3: paid and shipped --> send out email saying order is on its way and normal order times.
     */
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
