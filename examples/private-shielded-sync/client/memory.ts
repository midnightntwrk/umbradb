/**
 * The process's peak resident memory over a stretch of work (spec FR-151: "the process's peak resident size during
 * the step"): sampled every `everyMs` milliseconds on the calling thread, and taken from the operating system's
 * high-water mark (`maxRSS`) when that rose during the stretch, so a peak reached while the thread was busy is not
 * missed.
 */

export interface RssWatch {
  /** Stops sampling; the peak in bytes. */
  stop(): number;
}

const rssNow = (): number => process.memoryUsage.rss();
const maxRss = (): number => process.resourceUsage().maxRSS * 1024;

export function watchRss(everyMs = 10): RssWatch {
  const highWaterAtStart = maxRss();
  let peak = rssNow();
  const timer = setInterval(() => {
    peak = Math.max(peak, rssNow());
  }, everyMs);
  timer.unref();
  return {
    stop(): number {
      clearInterval(timer);
      peak = Math.max(peak, rssNow());
      const highWater = maxRss();
      return highWater > highWaterAtStart ? Math.max(peak, highWater) : peak;
    },
  };
}
