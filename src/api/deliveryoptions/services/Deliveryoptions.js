'use strict';

/* global Deliveryoptions */

/**
 * Deliveryoptions.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');

module.exports = {

  /**
   * Promise to fetch all deliveryoptions.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    const filters = convertRestQueryParams(params);
    const populateOpt = populate || Deliveryoptions.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)

    return buildQuery({
      model: Deliveryoptions,
      filters,
      populate: populateOpt,
    });
  },

  /**
   * Promise to fetch a/an deliveryoptions.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Deliveryoptions.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Deliveryoptions
      .findOne(_.pick(params, _.keys(Deliveryoptions.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to get a/an deliveryoptions and retuern default if not
   *
   * @return {Promise}
   */
   get: async (country) => {
     const init = await Deliveryoptions
      .findOne({ countries:  { "$regex": country || 'United Kingdom', "$options": "i" } })
      .lean()
    const fallback = await Deliveryoptions
      .findOne({ default: true })
      .lean()

    return init || fallback
   },

  /**
   * Promise to count deliveryoptions.
   *
   * @return {Promise}
   */

  count: (params) => {
    const filters = convertRestQueryParams(params);

    return buildQuery({
      model: Deliveryoptions,
      filters: { where: filters.where },
    })
      .count()
  },

  /**
   * Promise to add a/an deliveryoptions.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Deliveryoptions.associations.map(ast => ast.alias));
    const data = _.omit(values, Deliveryoptions.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Deliveryoptions.create(data);

    // Create relational data and return the entry.
    return Deliveryoptions.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an deliveryoptions.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Deliveryoptions.associations.map(a => a.alias));
    const data = _.omit(values, Deliveryoptions.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Deliveryoptions.updateOne(params, data, { multi: true });

    // Update relational data and return the entry.
    return Deliveryoptions.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an deliveryoptions.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Deliveryoptions.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Deliveryoptions
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Deliveryoptions.associations.map(async association => {
        if (!association.via || !data._id || association.dominant) {
          return true;
        }

        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an deliveryoptions.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('deliveryoptions', params);
    // Select field to populate.
    const populate = Deliveryoptions.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Deliveryoptions.attributes).reduce((acc, curr) => {
      switch (Deliveryoptions.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Deliveryoptions
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  }
};
