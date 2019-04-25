'use strict';

/**
 * Social.js controller
 *
 * @description: A set of functions called "actions" for managing `Social`.
 */

module.exports = {

  /**
   * Retrieve social records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.social.search(ctx.query);
    } else {
      return strapi.services.social.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a social record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.social.fetch(ctx.params);
  },

  /**
   * Count social records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.social.count(ctx.query);
  },

  /**
   * Create a/an social record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.social.add(ctx.request.body);
  },

  /**
   * Update a/an social record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.social.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an social record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.social.remove(ctx.params);
  }
};
