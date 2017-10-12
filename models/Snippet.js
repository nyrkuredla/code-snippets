const mongoose = require('mongoose')

//setting up schema
const SnippetSchema = new mongoose.Schema({
  author: String,
  title: {type: String, required: true},
  snippet: {type: String, required: true},
  notes: String,
  language: {type: String, required: true},
  tag: [{
    type: String
  }]
})

//function to find snippet by language
SnippetSchema.statics.findByLanguage = function (language, cb) {
  return this.find({language})
}

//function to find snippet by tag
SnippetSchema.statics.findByTag = function (tag ,cb) {
  return this.find({tag})
}

const Snippet = mongoose.model('Snippet', SnippetSchema)

module.exports = Snippet
