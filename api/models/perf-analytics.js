const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerfAnalyticksSchema = new Schema(
  {
    TTFB: {
      type: Number,
      required: true,
    },
    FCP: {
      type: Number,
    },
    DOMLoad: {
      type: Number,
    },
    WindowLoad: {
      type: Number,
    },
    ResourcesLoad: {
      type: Number,
    },
    createdAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
  },
);

PerfAnalyticksSchema.methods.view = function view(all) {
  const view = {
    id: this.id,
    FCP: this.FCP,
    TTFB: this.TTFB,
    DOMLoad: this.DOMLoad,
    WindowLoad: this.WindowLoad,
    ResourcesLoad: this.ResourcesLoad,
    createdAt: new Date(this.createdAt)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, ''),
    request: {
      type: 'GET',
      url: `https://perf-analytics-ercumentlacin.herokuapp.com/api/v1/perf-analytics/${this.id}`,
    },
  };

  if (all) {
    return {
      ...view,
      links: {
        self: `https://perf-analytics-ercumentlacin.herokuapp.com/api/v1/perf-analytics/${this.id}`,
      },
    };
  }

  return view;
};

module.exports = mongoose.model('perfanalyticks', PerfAnalyticksSchema);
