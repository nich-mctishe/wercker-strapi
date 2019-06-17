const fs = require('fs')

const getEmailHtml = file => fs.readFileSync(`${__dirname}/templates/${file}.html`, 'utf8');

const buildEmail = (template, variables) => {
  for (const index of Object.keys(variables.vars)) {
    const value = variables.vars[index]

    if (value || value === '') {
      template = template.replace(
        new RegExp('{{' + index + '}}', 'g'),
        ((typeof value === 'string' || typeof value === 'number' || value === '')) ? value : buildEmail(value.template, value))
    }
  }

  return template
}

const send = async (options, address, callback) => {
  const { MAILGUN_DOMAIN, MAILGUN_API_KEY } = process.env

  if (!MAILGUN_DOMAIN || !MAILGUN_API_KEY) {
    return callback('MAILGUN_DOMAIN or MAILGUN_API_KEY not present in environment variables')
  }

  const MailComposer = require('nodemailer/lib/mail-composer')
  const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN })
  const mail = new MailComposer(options)

  mail.compile().build((err, message) => {
    var dataToSend = {
      to: address,
      message: message.toString('ascii')
    };

    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
      if (sendError) {
        return callback(sendError);
      }

      return callback(null, body)
    });
  });
}

const subjects = {
  saved: 'Your basket from Rasha Swais has been saved',
  placed: 'Your order from Rasha Swais',
  shipped: 'Your order from Rasha Swais has been shipped',
  admin: 'Another Rasha Swais order for you to process'
}

module.exports = class {
  constructor (data, items, social, contact, delivery) {
    this.data = data
    this.items = items
    this.social = social.length ? buildEmail(getEmailHtml('socials'), {
      vars: {
        content: social.map(social => buildEmail(getEmailHtml('social'), {
            vars: {
              link: social.url,
              logo: social.icon.url,
              alt: social.name
            }
          })).join(''),
        width: 10 + (46 * social.length)
      }
    }) : ''
    this.contact = contact
    this.delivery = delivery
    this.baseOptions = {
      from: 'orders@rashaswais.com',
      to: data.email,
    }
    this.date = new Date()
    this.placed = new Date(data['date-placed'])

    this.send = this.send.bind(this)
    this.build = this.build.bind(this)
    this.summary = this.summary.bind(this)
  }

  summary () {
    return this.items.length ? this.items.map(item => buildEmail(getEmailHtml('item'), {
      vars: {
        quantity: item.quantity,
        name: item.product.Name,
        size: item.size,
        price: item['total-cost'].toFixed(2)
      }
    })).join('') : ''
  }

  build (master) {
    return Object.assign(this.baseOptions, {
      subject: subjects[master],
      html: buildEmail(getEmailHtml('template'), {
        vars: {
          content: {
            template: buildEmail(getEmailHtml('order'), {
              vars: {
                trackingCode: this.data.postaltrackingnumber || '',
                order: this.data.number
              }
            }),
            vars: {
              intro: getEmailHtml(master + '-intro'),
              date: `${this.placed.getDate()}\\${this.placed.getMonth()}\\${this.placed.getFullYear().toString().substr(-2)}`,
              time: `${this.placed.getHours()}:${this.placed.getMinutes()}:${this.placed.getSeconds()}`,
              items: this.summary(),
              subtotal: Number(this.data.subtotal).toFixed(2),
              deliveryService: this.delivery.service,
              deliveryCost: Number(this.delivery.cost).toFixed(2),
              total: Number(this.data.total).toFixed(2)
            }
          },
          copy: {
            template: getEmailHtml(master === 'saved' ? 'saved' : 'addresses'),
            vars: {
              number: this.data.number,
              contact: this.contact.detail || '',
              baseUrl: process.env.SITE_URL,
              orderId: this.data.id,
              phone: this.data.phone,
              billingAddress: this.data['billing-address'],
              shippingAddress: this.data['shipping-address']
            }
          },
          socials: this.social,
          year: this.date.getFullYear()
        }
      })
    })
  }

  async send (master, callback) {
    return await send(
      this.build(master),
      master === 'admin' ? 'rashaswais@gmail.com' : this.data.email,
      callback
    )
  }
}
