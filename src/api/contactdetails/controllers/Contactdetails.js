'use strict';

/**
 * Contactdetails.js controller
 *
 * @description: A set of functions called "actions" for managing `Contactdetails`.
 */

module.exports = {

  /**
   * Retrieve contactdetails records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.contactdetails.search(ctx.query);
    } else {
      return strapi.services.contactdetails.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a contactdetails record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.contactdetails.fetch(ctx.params);
  },

  /**
   * Count contactdetails records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.contactdetails.count(ctx.query);
  },

  /**
   * Create a/an contactdetails record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.contactdetails.add(ctx.request.body);
  },

  /**
   * Update a/an contactdetails record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.contactdetails.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an contactdetails record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.contactdetails.remove(ctx.params);
  }
};
