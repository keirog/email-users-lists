const mongoose = require('mongoose');
const updateEmitter = require('../utils/events.server.utils');

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
  email: {
    type: String,
    trim: true,
    required: 'email cannot be blank'
  },
  emailBlindIdx: {
    type: String,
    trim: true,
    index: { unique: true },
    required: 'email blind index cannot be blank'
  },
  metadata: {
    type: {}
  },
  lists: [listRelationshipSchema]
});

userSchema.index({
  "lists.list": 1,
  "expiredUser.value": 1,
  "suppressedAccount.value": 1,
  "suppressedRecommendation.value": 1,
  "suppressedMarketing.value": 1,
  "suppressedNewsletter.value": 1
}, { name: "compound1", background: true });

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

userSchema.post('save', (user) => {
  updateEmitter.emit('user-update', user);
});

//We always want emails to be encrypted
userSchema.path('email').validate((value) => {
  return /^[0-9A-F:]+$/i.test(value);
}, 'The email to save is not encrypted');

mongoose.model('User', userSchema);
