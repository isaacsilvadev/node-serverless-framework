import type { ScheduledEvent } from 'aws-lambda'

export default class ScheduledEventWrapper {
  private readonly event: ScheduledEvent

  constructor(event: ScheduledEvent) {
    this.event = event
  }

  getTime(): Date {
    return new Date(this.event.time)
  }
}
