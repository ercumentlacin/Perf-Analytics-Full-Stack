const express = require('express');
const router = express.Router();

const PerfAnalyticks = require('../models/perf-analytics');

router.get('/', async (req, res, next) => {
  console.log('req.query :>> ', req.query);
  try {
    let { from, to } = req.query;
    let query;
    const thirtyMinutes = 1000 * 60 * 30;
    from = from ? new Date(from).getTime() : Date.now() - thirtyMinutes;
    to = to ? new Date(to).getTime() : undefined;

    if (from && to) {
      query = {
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      };
    } else {
      query = {
        createdAt: {
          $gte: new Date(from),
        },
      };
    }

    console.log('query :>> ', query);

    const results = await PerfAnalyticks.find(query);
    res.status(200).json(results.map((result) => result.view()));
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const metric = new PerfAnalyticks(body);
    const savedMetric = await metric.save();
    console.log('savedMetric 🎉 ');
    return res.status(201).json(savedMetric);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  PerfAnalyticks.findById(id)
    .then((metric) => {
      res.status(200).json(metric.view());
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
