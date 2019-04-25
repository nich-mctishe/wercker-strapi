'use strict';

/**
 * Carousel.js controller
 *
 * @description: A set of functions called "actions" for managing `Carousel`.
 */

module.exports = {

  /**
   * Retrieve carousel records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.carousel.search(ctx.query);
    } else {
      return strapi.services.carousel.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a carousel record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.carousel.fetch(ctx.params);
  },

  /**
   * Count carousel records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.carousel.count(ctx.query);
  },

  /**
   * Create a/an carousel record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.carousel.add(ctx.request.body);
  },

  /**
   * Update a/an carousel record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.carousel.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an carousel record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.carousel.remove(ctx.params);
  }
};
