const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

class ProgressBar {
  constructor(max) {
    // Initialize progress bar.
    this.bar = new cliProgress.SingleBar({
      format:
        'Progress |' +
        colors.cyan('{bar}') +
        '| {percentage} % || {value} / {total} Iterations || Time Elapsed: {duration_formatted}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      stopOnComplete: true,
    })

    // Values.
    this.value = 0
    this.max = max
  }

  start() {
    this.bar.start(this.max, this.value, { text: '' })
  }

  update(value, string) {
    this.bar.update(value, { text: string })
  }

  stop() {
    this.bar.stop()
  }
}

module.exports = ProgressBar;