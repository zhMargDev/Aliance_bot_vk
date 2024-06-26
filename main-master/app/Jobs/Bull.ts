const Bull = require('bull')
import Env from '@ioc:Adonis/Core/Env'

const redis = {
  host: Env.get('REDIS_HOST'),
  port: Env.get('REDIS_PORT'),
  maxRetriesPerRequest: null,
  connectTimeout: 180000,
}

const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: false,
}

const limiter = {
  max: 10000,
  duration: 1000,
  bounceBack: false,
}

const settings = {
  lockDuration: 60000, // Key expiration time for job locks.
  stalledInterval: 5000, // How often check for stalled jobs (use 0 for never checking).
  maxStalledCount: 10, // Max amount of times a stalled job will be re-processed.
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  retryProcessDelay: 30000, // delay before processing next job in case of internal error.
  drainDelay: 5, // A timeout for when the queue is in drained state (empty waiting for jobs).
}

const bull = new Bull('my_queue_new', { redis, defaultJobOptions, settings, limiter })

module.exports = { bull }
