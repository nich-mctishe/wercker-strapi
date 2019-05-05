'use strict';

/**
 * Items.js controller
 *
 * @description: A set of functions called "actions" for managing `Items`.
 */

module.exports = {

  /**
   * Retrieve items records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.items.search(ctx.query);
    } else {
      return strapi.services.items.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a items record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.items.fetch(ctx.params);
  },

  /**
   * Count items records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.items.count(ctx.query);
  },

  /**
   * Create a/an items record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.items.add(ctx.request.body);
  },

  /**
   * Create a/an items record.
   *
   * @return {Object}
   */
  createMany: async (ctx) => {
    const items = cxt.request.items
    const rtn = []

    for (var i = 0; i < items.length; i++) {
      const item = await strapi.services.items.add(items[i])

      rtn.push(item)
    }

    return rtn
  },

  /**
   * Update a/an items record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.items.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an items record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.items.remove(ctx.params);
  },

  /**
   * Destroy many items records.
   *
   * @return {Object}
   */
  destroyMany: async (ctx, next) => {
    for (var i = 0; i < ctx.params.items.length; i++) {
      await strapi.services.items.remove({ _id: ctx.request.body.items[i] })
    }
  }
};
