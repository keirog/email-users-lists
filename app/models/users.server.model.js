'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listRelationshipSchema = new Schema({
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    index: true
  },
  unsubscribeKey: {
    type: String,
    required: 'Missing the unsubscribeKey'
  }
},
{
  _id : false,
  read: 'secondaryPreferred'
});

const userSchema = new Schema({
  uuid: {
    type: String,
    trim: true,
    index: {unique: true, sparse: true}
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  expired: {
    type: Boolean,
    default: false,
    index: true
  },
  expiredUser: {
    value: {
      type: Boolean,
      default: false,
      index: true
    },
    updatedAt: {
      type: Date
    }
  },
  suppressedNewsletter: {
    value: {
      type: Boolean,
      default: false,
      index: true
    },
    reason: {
      type: String
    },
    updatedAt: {
      type: Date
    }
  },
  suppressedMarketing: {
    value: {
      type: Boolean,
      default: false,
      index: true
    },
    reason: {
      type: String
    },
    updatedAt: {
      type: Date
    }
  },
  suppressedRecommendation: {
    value: {
      type: Boolean,
      default: false,
      index: true
    },
    reason: {
      type: String
    },
    updatedAt: {
      type: Date
    }
  },
  suppressedAccount: {
    value: {
      type: Boolean,
      default: false,
      index: true
    },
    reason: {
      type: String
    },
    updatedAt: {
      type: Date
    }
  },
  manuallySuppressed: {
    type: Boolean,
    default: false,
    index: true
  },
  automaticallySuppressed: {
    type: Boolean,
    default: false,
    index: true
  },
  externallySuppressed: {
    type: Boolean,
    default: false,
    index: true
  },
  email: {
    type: String,
    trim: true,
    index: { unique: true },
    required: 'email cannot be blank'
  },
  metadata: {
    type: {}
  },
  lists: [listRelationshipSchema]
});

userSchema.pre('save', function (next) {
  const suppressionTypes = [
    'suppressedAccount',
    'suppressedRecommendation',
    'suppressedMarketing',
    'suppressedNewsletter',
    'expiredUser'
  ];
  for (const suppressionType of suppressionTypes) {
    if (this.isModified(suppressionType)) {
      this[suppressionType].updatedAt = new Date();
    }
  }
  next();
});

//We always want emails to be encrypted
userSchema.path('email').validate((value) => {
  return /^[0-9A-F]+$/i.test(value);
}, 'The email to save is not encrypted');

userSchema.index({  externallySuppressed: 1, automaticallySuppressed: 1, manuallySuppressed: 1, expired: 1, "lists.list": 1 });
userSchema.index({  externallySuppressed: 1, automaticallySuppressed: 1, manuallySuppressed: 1, expired: 1 });

mongoose.model('User', userSchema);
