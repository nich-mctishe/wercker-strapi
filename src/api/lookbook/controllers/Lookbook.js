'use strict';

/**
 * Lookbook.js controller
 *
 * @description: A set of functions called "actions" for managing `Lookbook`.
 */

module.exports = {

  /**
   * Retrieve lookbook records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.lookbook.search(ctx.query);
    } else {
      return strapi.services.lookbook.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a lookbook record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.lookbook.fetch(ctx.params);
  },

  /**
   * Count lookbook records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.lookbook.count(ctx.query);
  },

  /**
   * Create a/an lookbook record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.lookbook.add(ctx.request.body);
  },

  /**
   * Update a/an lookbook record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.lookbook.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an lookbook record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.lookbook.remove(ctx.params);
  }
};
