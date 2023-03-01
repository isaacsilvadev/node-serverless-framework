import ScheduleEventFactory from '../../_helper/ScheduleEventFactory'

import ScheduledEventWrapper from '../../../../src/nsf/aws/event/ScheduledEventWrapper'

describe('Get Time', () => {
  test('should return event date in milliseconds', () => {
    const time = new Date()
    expect(new ScheduledEventWrapper(ScheduleEventFactory.newEvent(time.toISOString())).getTime()).toStrictEqual(time)
  })
})
