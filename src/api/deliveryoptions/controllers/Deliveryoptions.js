'use strict';

/**
 * Deliveryoptions.js controller
 *
 * @description: A set of functions called "actions" for managing `Deliveryoptions`.
 */

module.exports = {

  /**
   * Retrieve deliveryoptions records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.deliveryoptions.search(ctx.query);
    } else {
      return strapi.services.deliveryoptions.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a deliveryoptions record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.deliveryoptions.fetch(ctx.params);
  },

  /**
   * Count deliveryoptions records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.deliveryoptions.count(ctx.query);
  },

  /**
   * Create a/an deliveryoptions record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.deliveryoptions.add(ctx.request.body);
  },

  /**
   * Update a/an deliveryoptions record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.deliveryoptions.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an deliveryoptions record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.deliveryoptions.remove(ctx.params);
  }
};
