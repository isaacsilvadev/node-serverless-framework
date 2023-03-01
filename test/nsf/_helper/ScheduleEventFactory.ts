import { faker } from '@faker-js/faker'
import type { ScheduledEvent } from 'aws-lambda'

export default class ScheduleEventFactory {
  static newEvent(time = faker.date.recent().toISOString()): ScheduledEvent {
    return {
      account: faker.random.numeric(12),
      detail: {
        EventCategories: [faker.lorem.word()],
        SourceType: faker.lorem.slug(),
        SourceArn: faker.lorem.slug(),
        Date: faker.date.recent().toISOString(),
        Message: faker.lorem.sentence(),
        SourceIdentifier: faker.random.alphaNumeric(14)
      },
      'detail-type': faker.lorem.sentence(),
      id: faker.random.alphaNumeric(15),
      region: faker.lorem.slug(),
      resources: [faker.lorem.slug()],
      source: faker.lorem.word(),
      time,
      version: faker.random.numeric(1)
    } as ScheduledEvent
  }
}
