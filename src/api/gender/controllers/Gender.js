'use strict';

/**
 * Gender.js controller
 *
 * @description: A set of functions called "actions" for managing `Gender`.
 */

module.exports = {

  /**
   * Retrieve gender records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.gender.search(ctx.query);
    } else {
      return strapi.services.gender.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a gender record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.gender.fetch(ctx.params);
  },

  /**
   * Count gender records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.gender.count(ctx.query);
  },

  /**
   * Create a/an gender record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.gender.add(ctx.request.body);
  },

  /**
   * Update a/an gender record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.gender.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an gender record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.gender.remove(ctx.params);
  }
};
