const Analytics = require('analytics-node');

const segmentClient = new Analytics(process.env.NEXT_PUBLIC_SEGMENT_NODE_WRITE_KEY, { flushAt: 1 });

export default segmentClient