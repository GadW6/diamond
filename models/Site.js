const mongoose = require('./DB')

const siteSchema = new mongoose.Schema({
  titleHero: {
    type: String,
    required: true,
    trim: true
  },
  subTitleHero: {
    type: String,
    required: true,
    trim: true
  },
  authQuote: {
    type: String,
    required: true,
    trim: true
  },
  bodyQuote: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  baseAdd: {
    type: String,
    required: true,
    trim: true
  },
  cityAdd: {
    type: String,
    required: true,
    trim: true
  },
  countryAdd: {
    type: String,
    required: true,
    trim: true
  },
  termsTitle: {
    type: String,
    required: true,
    trim: true
  },
  termsBody: [{
    sub: {
      type: String,
      required: true,
      trim: true
    },
    para: {
      type: String,
      required: true,
      trim: true
    }
  }],
  privacyTitle: {
    type: String,
    required: true,
    trim: true
  },
  privacyBody: [{
    sub: {
      type: String,
      required: true,
      trim: true
    },
    para: {
      type: String,
      required: true,
      trim: true
    }
  }]
})

//// Prepopulate

// const Site = mongoose.model('site', siteSchema)

// ////////UPDATE
// Site.findOne({
//   countryAdd: "Belgium"
// }).then(site => {
//   site.phone = 32475257949
//   site.save()
// })
// //////ADD
// const site = new Site({
//   titleHero: "Affordable Jewelry",
//   subTitleHero: "We pay attention to details and create beautiful designs according to your desires.",
//   authQuote: "Yair Weintraub / CEO",
//   bodyQuote: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit!",
//   phone: 0032475257949,
//   email: "mywein@hotmail.com",
//   baseAdd: "Diamond Avenue 1010",
//   cityAdd: "Antwerpen",
//   countryAdd: "Belgium"
// })
// site.save().then(() => console.log("Inserted"))

// Users Model
module.exports = mongoose.model('site', siteSchema)